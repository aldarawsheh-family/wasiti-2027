import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'wasity-jwt-secret-change-in-production-2027',
      signOptions: { expiresIn: '1h' },
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, AuthGuard, TenantGuard, RolesGuard],
})
export class AppModule {}