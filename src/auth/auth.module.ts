import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { NATSConfigService } from '../config/NATSConfigService';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, LocalStrategy,
    JwtStrategy, NATSConfigService,
  {
    provide: 'AUTH_CLIENT',
    useFactory: (natsConfigService: NATSConfigService) => ({
      ...natsConfigService.getNATSConfig
    }),
    inject: [NATSConfigService]
  }],
  exports: [AuthService]
})
export class AuthModule {}
