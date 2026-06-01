import { MessagesService } from './messages/messages.service';
import { MessageRole } from './messages/enums/message-role.enum';
import { WorkflowService } from './workflow/workflow.service';
import { SessionsService } from './sessions/sessions.service';
import { SESSION_STATE } from './llm/constants/system-prompt.constant';
import { Logger } from '@nestjs/common';

export abstract class AppService {
  private readonly appLogger = new Logger(AppService.name);

  constructor(
    protected readonly messagesService: MessagesService,
    protected readonly workflowService: WorkflowService,
    protected readonly sessionsService: SessionsService,
  ) {}

  abstract getLlmResponse(message: string, user_token: string, stage: SESSION_STATE, context: string, activeMessages: string[]): Promise<string>;
  abstract summarizeMessages(messages: string[]): Promise<string>;

  async processMessage(message: string, user_token: string, session_id: string): Promise<{success: boolean, data: string, sessionFinished: boolean}> {
    // 1. Process client message in workflow
    let workflowUpdate = await this.workflowService.addMessage(session_id, message, MessageRole.CLIENT);
    
    // 2. Check transition (limit reached)
    if (workflowUpdate.needsTransition) {
      this.appLogger.log(`[Session ${session_id}] Transition required. Creating summary for ${workflowUpdate.messagesToSummarize.length} messages...`);
      const summary = await this.summarizeMessages(workflowUpdate.messagesToSummarize);
      this.appLogger.log(`[Session ${session_id}] Summary created:\n${summary}`);
      await this.workflowService.transitionStage(session_id, summary);
      await this.messagesService.markMessagesAsHistory(user_token, session_id);
      // After transition, get the updated state
      const newState = await this.workflowService.getCurrentState(session_id);
      workflowUpdate.stage = newState.stage;
    }

    // 3. Get current context
    const currentState = await this.workflowService.getCurrentState(session_id);
    const activeMessages = await this.messagesService.getActiveContext(user_token, session_id);

    // 4. Append ending prompt if session is finished
    const llmMessage = `${message}\n${workflowUpdate.sessionFinished ? 'Это твой финальный ответ в этой сессии, учитывай это при ответе' : ''}`

    // 5. Get LLM Response
    const response = await this.getLlmResponse(llmMessage, user_token, currentState.stage, currentState.context, activeMessages);
    
    // 6. Process AI response in workflow
    await this.workflowService.addMessage(session_id, response, MessageRole.AI);

    // 7. Save to message history
    await this.messagesService.addMessages(user_token, session_id, [
      { text: message, role: MessageRole.CLIENT },
      { text: response, role: MessageRole.AI }
    ]);

    // 8. Close session if finished
    if (workflowUpdate.sessionFinished) {
      await this.sessionsService.closeSession(session_id);
      await this.messagesService.markMessagesAsHistory(user_token, session_id);
    }

    return { success: true, data: response, sessionFinished: workflowUpdate.sessionFinished };
  }
}
