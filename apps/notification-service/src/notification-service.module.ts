import { Module } from '@nestjs/common';
import { NotifyModule } from './notify/notify.module';
import { SseModule } from './sse/sse.module';
import { NotifyKafkaConsumerService } from './kafka/kafka-consumer.service';

@Module({
  imports: [NotifyModule, SseModule],
  providers: [],
  controllers: [],
})
export class NotificationServiceModule {}
