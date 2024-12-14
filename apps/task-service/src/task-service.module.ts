import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { CmntModule } from './cmnt/cmnt.module';
import { SseModule } from './sse/sse.module';

@Module({
  imports: [TaskModule, CmntModule, SseModule],
  controllers: [],
  providers: [],
})
export class TaskServiceModule {}
