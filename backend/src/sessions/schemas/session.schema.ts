import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as crypto from 'crypto';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, unique: true, default: () => crypto.randomUUID() })
  sessionId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ default: '' })
  title: string;

  @Prop({ default: true })
  isOpen: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
