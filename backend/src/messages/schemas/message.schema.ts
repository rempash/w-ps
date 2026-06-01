import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { MessageRole } from '../enums/message-role.enum';

export type MessageHistoryDocument = MessageHistory & Document;

@Schema({ _id: false })
export class MessageItem {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true, enum: MessageRole })
  role: MessageRole;

  @Prop({ default: false })
  is_history: boolean;
}

export const MessageItemSchema = SchemaFactory.createForClass(MessageItem);

@Schema({ timestamps: true })
export class MessageHistory {
  @Prop({ required: true })
  user_token: string;

  @Prop({ required: true, unique: true })
  session_id: string;

  @Prop({ type: [MessageItemSchema], default: [] })
  messages: MessageItem[];
}

export const MessageHistorySchema = SchemaFactory.createForClass(MessageHistory);
