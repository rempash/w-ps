import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkflowService } from './workflow.service';
import { SessionState, SessionStateSchema } from './schemas/session-state.schema';
import { StageMessages, StageMessagesSchema } from './schemas/stage-messages.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionState.name, schema: SessionStateSchema },
      { name: StageMessages.name, schema: StageMessagesSchema },
    ]),
  ],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
