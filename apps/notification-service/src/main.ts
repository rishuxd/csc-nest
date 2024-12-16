import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,OPTIONS',
    credentials: true,
  });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5051',
      package: ['notify'],
      protoPath: [join(__dirname, '../notify.proto')],
    },
  });

  await app.startAllMicroservices();
  await app.listen(5002);
}
bootstrap();
