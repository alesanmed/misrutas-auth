import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { CONFIG } from './config/transport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      ...CONFIG.NATS
    }
  });
  app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
