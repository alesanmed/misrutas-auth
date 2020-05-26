import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './interceptors/TimeoutInterceptor';
import { Logger } from '@nestjs/common';
import { NATSConfigService } from './config/NATSConfigService';
import { AllExceptionsFilter } from './filters/ExceptionsFilter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true,
  });

  const natsConfigService: NATSConfigService = app.get(NATSConfigService);
  const configService : ConfigService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice({
    ...natsConfigService.getNATSConfig
  });
  app.use(helmet());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.startAllMicroservicesAsync();
  await app.listen(configService.get<number>('PORT') || 3000, () => Logger.log('Microservice running'));
}
bootstrap();
