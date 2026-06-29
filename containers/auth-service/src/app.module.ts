import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { RedisService } from './redis.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_super_secret_key_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, HealthController],
  providers: [AuthService, JwtService, RedisService],
})
export class AppModule {}