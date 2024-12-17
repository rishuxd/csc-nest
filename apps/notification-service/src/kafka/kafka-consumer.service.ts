import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { NotifyService } from '../notify/notify.service';
import { Task } from 'types/task';
import { Cmnt } from 'types/cmnt';
import { CreateNotificationRequest } from 'types/notify';

@Injectable()
export class MsgKafkaConsumerService implements OnModuleInit {
  private readonly kafka = new Kafka({ brokers: ['localhost:9092'] });
  private readonly consumer: Consumer;

  constructor(private readonly notifyService: NotifyService) {
    this.consumer = this.kafka.consumer({ groupId: 'msg-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'task-events',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { eventType, data, participants } = JSON.parse(
          message.value.toString(),
        );

        console.log(
          `Received event: ${eventType} with data: ${JSON.stringify(data)}`,
        );

        switch (eventType) {
          case 'task-created':
            await this.handleTaskCreated(data, participants);
            break;
          case 'task-deleted':
            await this.handleTaskDeleted(data, participants);
            break;
          case 'cmnt-created':
            await this.handleCmntCreated(data, participants);
            break;
          default:
            console.warn(`Unknown event type: ${eventType}`);
        }
      },
    });
  }

  private async handleTaskCreated(data: Task, participants: string[]) {
    const notificationData: CreateNotificationRequest = {
      title: 'Task Created',
      desc: `Task '${data.title}' is created.`,
      participants,
      refId: data.id,
      refName: 'Task',
      notifyType: 'task',
    };

    await this.notifyService.createNotification(notificationData);
  }

  private async handleTaskDeleted(data: Task, participants: string[]) {
    const notificationData: CreateNotificationRequest = {
      title: 'Task Deleted',
      desc: `Task '${data.title}' is deleted.`,
      participants,
      refId: data.id,
      refName: 'Task',
      notifyType: 'task',
    };

    await this.notifyService.createNotification(notificationData);
  }

  private async handleCmntCreated(data: Cmnt, participants: string[]) {
    const notificationData: CreateNotificationRequest = {
      title: 'Comment Added',
      desc: `A new comment is added: '${data.content}'`,
      participants,
      refId: data.id,
      refName: 'Comment',
      notifyType: 'comment',
    };

    await this.notifyService.createNotification(notificationData);
  }
}
