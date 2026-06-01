import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSystemPrompt, getSummaryPrompt, SESSION_STATE } from './constants/system-prompt.constant';
import { AppService } from '../app.service';
import { MessagesService } from '../messages/messages.service';
import { WorkflowService } from '../workflow/workflow.service';

import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class GeminiService extends AppService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    messagesService: MessagesService,
    workflowService: WorkflowService,
    sessionsService: SessionsService,
  ) {
    super(messagesService, workflowService, sessionsService);
    // Initialize Gemini client
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_for_now');
  }

  async getLlmResponse(message: string, user_token: string, stage: SESSION_STATE, context: string, activeMessages: string[]): Promise<string> {
    try {
      this.logger.log(`Sending message to LLM from ${user_token} (Stage: ${stage})`);
      
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: getSystemPrompt(stage, activeMessages, context),
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: message }] }],
      });

      return result.response.text() || 'No response from LLM';
    } catch (error) {
      this.logger.error('Failed to get LLM response', error);
      throw new Error('Failed to process message');
    }
  }

  async summarizeMessages(messages: string[]): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const prompt = getSummaryPrompt(messages);
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      return result.response.text() || 'No summary generated';
    } catch (error) {
      this.logger.error('Failed to summarize messages', error);
      throw new Error('Failed to summarize messages');
    }
  }
}
