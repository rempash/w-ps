import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageHistory, MessageHistoryDocument } from './schemas/message.schema';
import { MessageRole } from './enums/message-role.enum';

export interface IMessageInput {
  text: string;
  role: MessageRole;
}

@Injectable()
export class MessagesService {
  constructor(@InjectModel(MessageHistory.name) private messageHistoryModel: Model<MessageHistoryDocument>) {}

  async addMessage(user_token: string, session_id: string, text: string, role: MessageRole): Promise<MessageHistory> {
    return this.addMessages(user_token, session_id, [{ text, role }]);
  }

  async addMessages(user_token: string, session_id: string, messages: IMessageInput[]): Promise<MessageHistory> {
    let history = await this.messageHistoryModel.findOne({ user_token, session_id }).exec();
    
    if (!history) {
      history = new this.messageHistoryModel({ user_token, session_id, messages: [] });
    }
    
    const newMessages = messages.map(msg => ({
      timestamp: new Date(),
      text: msg.text,
      role: msg.role,
      is_history: false,
    }));

    history.messages.push(...newMessages);

    return history.save();
  }

  async getMessages(user_token: string, session_id: string): Promise<MessageHistory | null> {
    return this.messageHistoryModel.findOne({ user_token, session_id }).exec();
  }

  async getActiveContext(user_token: string, session_id: string): Promise<string[]> {
    const history = await this.messageHistoryModel.findOne({ user_token, session_id }).exec();
    if (!history) return [];
    
    return history.messages
      .filter(msg => !msg.is_history)
      .map(msg => `${msg.role === MessageRole.CLIENT ? 'User' : 'AI'}: ${msg.text}`);
  }

  async markMessagesAsHistory(user_token: string, session_id: string): Promise<void> {
    const history = await this.messageHistoryModel.findOne({ user_token, session_id }).exec();
    if (!history) return;

    let modified = false;
    for (const msg of history.messages) {
      if (!msg.is_history) {
        msg.is_history = true;
        modified = true;
      }
    }

    if (modified) {
      await history.save();
    }
  }
}
