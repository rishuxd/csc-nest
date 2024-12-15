import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TaskSchema } from './schema/task.schema';
import { TaskServiceKafkaProducerService } from '../kafka/kafka-producer.service';
import { CmntSchema } from '../cmnt/schema/cmnt.schema';
import { CmntModule } from '../cmnt/cmnt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: 'Cmnt', schema: CmntSchema }]),
    CmntModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskServiceKafkaProducerService],
})
export class TaskModule {}
