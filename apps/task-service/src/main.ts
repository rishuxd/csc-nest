import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(TaskServiceModule);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5050',
      package: ['task', 'cmnt'],
      protoPath: [
        join(__dirname, '../task.proto'),
        join(__dirname, '../cmnt.proto'),
      ],
    },
  });

  await app.startAllMicroservices();
  await app.listen(5001);
}
bootstrap();
