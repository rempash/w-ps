import { Injectable, Logger } from '@nestjs/common';
import { AppService } from '../app.service';
import { MessagesService } from '../messages/messages.service';
import { WorkflowService } from '../workflow/workflow.service';
import { SESSION_STATE } from './constants/system-prompt.constant';

import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class MockLlmService extends AppService {
  private readonly logger = new Logger(MockLlmService.name);

  constructor(
    messagesService: MessagesService,
    workflowService: WorkflowService,
    sessionsService: SessionsService,
  ) {
    super(messagesService, workflowService, sessionsService);
  }

  async getLlmResponse(message: string, user_token: string, stage: SESSION_STATE, context: string, activeMessages: string[]): Promise<string> {
    this.logger.log(`Mocking LLM response for user ${user_token} and message: "${message}" in stage: ${stage}`);
    return `[Mock Service] Я Ванесса, твой личный помощник. Ты написал: "${message}". Это замоканный ответ, этап: ${stage}.`;
  }

  async summarizeMessages(messages: string[]): Promise<string> {
    this.logger.log(`Mocking LLM summarize for messages`);
    return `[Mock Summary] Сообщения клиента проанализированы и сжаты.`;
  }
}
