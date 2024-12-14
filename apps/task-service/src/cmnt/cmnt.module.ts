import { Module } from '@nestjs/common';
import { CmntService } from './cmnt.service';
import { CmntController } from './cmnt.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CmntSchema } from './schema/cmnt.schema';
import { TaskSchema } from '../task/schema/task.schema';
import { SseModule } from '../sse/sse.module';
import { TaskServiceKafkaProducerService } from '../kafka/kafka-producer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: 'Cmnt', schema: CmntSchema },
      { name: 'Task', schema: TaskSchema },
    ]),
    SseModule,
  ],
  controllers: [CmntController],
  providers: [CmntService, TaskServiceKafkaProducerService],
})
export class CmntModule {}
