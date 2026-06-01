import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageHistory, MessageHistorySchema } from './schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MessageHistory.name, schema: MessageHistorySchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
