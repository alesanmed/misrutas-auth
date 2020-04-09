import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './interceptors/TimeoutInterceptor';
import { Logger } from '@nestjs/common';
import { NATSConfigService } from './config/NATSConfigService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true,
  });

  const natsConfigService: NATSConfigService = app.get(NATSConfigService);

  app.connectMicroservice({
    ...natsConfigService.getNATSConfig
  });
  app.use(helmet());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.startAllMicroservicesAsync();
  await app.listen(3000, () => Logger.log('Microservice running'));
}
bootstrap();
