import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as crypto from 'crypto';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, default: () => crypto.randomUUID() })
  user_id: string;

  @Prop({ required: true, unique: true })
  user_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
