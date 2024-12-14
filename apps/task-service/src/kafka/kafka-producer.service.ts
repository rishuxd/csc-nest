import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class TaskServiceKafkaProducerService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
      },
    });
  }

  async emitEvent(eventType: string, data: any): Promise<void> {
    await this.client.emit('task-events', { eventType, data }).toPromise();
  }
}
