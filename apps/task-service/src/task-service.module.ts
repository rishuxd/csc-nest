import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { CmntModule } from './cmnt/cmnt.module';

@Module({
  imports: [TaskModule, CmntModule],
  controllers: [],
  providers: [],
})
export class TaskServiceModule {}
