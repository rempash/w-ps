import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GeminiService } from './llm/gemini.service';
import { MockLlmService } from './llm/mock-llm.service';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { WorkflowModule } from './workflow/workflow.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-psychology'),
    UsersModule,
    MessagesModule,
    WorkflowModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: process.env.USE_MOCK_LLM === 'true' ? MockLlmService : GeminiService,
    },
  ],
})
export class AppModule { }
