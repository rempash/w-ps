import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionState, SessionStateDocument } from './schemas/session-state.schema';
import { StageMessages, StageMessagesDocument } from './schemas/stage-messages.schema';
import { SESSION_STATE } from '../llm/constants/system-prompt.constant';
import { MessageRole } from '../messages/enums/message-role.enum';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    @InjectModel(SessionState.name) private sessionStateModel: Model<SessionStateDocument>,
    @InjectModel(StageMessages.name) private stageMessagesModel: Model<StageMessagesDocument>,
  ) {}

  async getCurrentState(session_id: string): Promise<SessionStateDocument> {
    let state = await this.sessionStateModel.findOne({ session_id }).exec();
    if (!state) {
      state = new this.sessionStateModel({
        session_id,
        stage: SESSION_STATE.INTRO,
        context: '',
      });
      await state.save();
    }
    return state;
  }

  async addMessage(
    session_id: string,
    text: string,
    role: MessageRole,
  ): Promise<{ needsTransition: boolean; sessionFinished: boolean; messagesToSummarize: string[]; stage: SESSION_STATE }> {
    let stageMessages = await this.stageMessagesModel.findOne({ session_id }).exec();
    const currentState = await this.getCurrentState(session_id);

    if (!stageMessages) {
      stageMessages = new this.stageMessagesModel({
        session_id,
        messages: [],
        stage: currentState.stage,
        client_messages_count: 0,
      });
    }

    // Format message
    const formattedMessage = `${role === MessageRole.CLIENT ? 'User' : 'AI'}: ${text}`;
    stageMessages.messages.push(formattedMessage);

    if (role === MessageRole.CLIENT) {
      stageMessages.client_messages_count += 1;
    }

    await stageMessages.save();

    const limitReached = stageMessages.client_messages_count >= 4;
    const remainingMessages = Math.max(0, 4 - stageMessages.client_messages_count);
    
    this.logger.log(`Session [${session_id}] | State: ${currentState.stage} | Messages Count: ${stageMessages.client_messages_count}/4 | Remaining until transition/end: ${remainingMessages}`);

    const needsTransition = limitReached && currentState.stage !== SESSION_STATE.OUTRO;
    const sessionFinished = limitReached && currentState.stage === SESSION_STATE.OUTRO;

    return {
      needsTransition,
      sessionFinished,
      messagesToSummarize: needsTransition ? stageMessages.messages : [],
      stage: currentState.stage,
    };
  }

  async transitionStage(session_id: string, newContext: string): Promise<void> {
    const currentState = await this.getCurrentState(session_id);
    let nextStage: SESSION_STATE = currentState.stage;

    if (currentState.stage === SESSION_STATE.INTRO) {
      nextStage = SESSION_STATE.INTERVENTION;
    } else if (currentState.stage === SESSION_STATE.INTERVENTION) {
      nextStage = SESSION_STATE.OUTRO;
    }

    currentState.stage = nextStage;
    currentState.context = newContext;
    await currentState.save();

    await this.stageMessagesModel.deleteOne({ session_id }).exec();
  }
}
