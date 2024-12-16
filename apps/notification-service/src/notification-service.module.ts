import { Module } from '@nestjs/common';
import { NotifyModule } from './notify/notify.module';
import { SseModule } from './sse/sse.module';

@Module({
  imports: [NotifyModule, SseModule],
})
export class NotificationServiceModule {}
