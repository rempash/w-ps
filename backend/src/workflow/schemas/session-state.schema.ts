import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SESSION_STATE } from '../../llm/constants/system-prompt.constant';

export type SessionStateDocument = SessionState & Document;

@Schema({ timestamps: true })
export class SessionState {
  @Prop({ required: true, unique: true })
  session_id: string;

  @Prop({ required: true, enum: SESSION_STATE })
  stage: SESSION_STATE;

  @Prop({ default: '' })
  context: string;
}

export const SessionStateSchema = SchemaFactory.createForClass(SessionState);
