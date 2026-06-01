import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SESSION_STATE } from '../../llm/constants/system-prompt.constant';

export type StageMessagesDocument = StageMessages & Document;

@Schema({ timestamps: true })
export class StageMessages {
  @Prop({ required: true, unique: true })
  session_id: string;

  @Prop({ type: [String], default: [] })
  messages: string[];

  @Prop({ required: true, enum: SESSION_STATE })
  stage: SESSION_STATE;

  @Prop({ default: 0 })
  client_messages_count: number;
}

export const StageMessagesSchema = SchemaFactory.createForClass(StageMessages);
