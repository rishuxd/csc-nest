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
          clientId: 'task-producer-client',
          brokers: ['localhost:9092'],
        },
      },
    });
  }

  async emitEvent(
    eventType: string,
    participants: string[],
    data: any,
  ): Promise<void> {
    console.log('Emitting task-events event:', eventType, participants);
    try {
      await this.client
        .emit('task-events', { eventType, data, participants })
        .toPromise();
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error emitting Kafka event:', error.message);
    }
  }
}
