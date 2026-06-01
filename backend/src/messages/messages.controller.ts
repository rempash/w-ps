import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get(':token/:sessionId')
  async getMessages(@Param('token') token: string, @Param('sessionId') sessionId: string) {
    console.log('kek')
    const history = await this.messagesService.getMessages(token, sessionId);
    return history ? history.messages : [];
  }
}
