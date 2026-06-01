import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  async getActiveSession(userId: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ userId, isOpen: true }).exec();
  }

  async createSession(userId: string): Promise<SessionDocument> {
    const activeSession = await this.getActiveSession(userId);
    if (activeSession) {
      return activeSession;
    }

    const session = new this.sessionModel({ userId });
    return session.save();
  }

  async closeSession(sessionId: string): Promise<SessionDocument> {
    const session = await this.sessionModel.findOne({ sessionId }).exec();
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    
    session.isOpen = false;
    return session.save();
  }
}
