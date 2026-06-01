import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatRequestDto } from './chat.dto';
import { SessionsService } from './sessions/sessions.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sessionsService: SessionsService,
  ) { }

  @Post('start-session')
  async startSession(@Body('user_token') user_token: string) {
    const session = await this.sessionsService.createSession(user_token);
    return { sessionId: session.sessionId };
  }

  @Post('chat')
  @UsePipes(new ValidationPipe({ transform: true }))
  async chat(@Body() chatRequest: ChatRequestDto) {
    console.log('got the message from user', chatRequest.user_token, 'session', chatRequest.session_id);
    
    const result = await this.appService.processMessage(chatRequest.message, chatRequest.user_token, chatRequest.session_id);
    console.log(result);

    return result;
  }
}
