// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventBus } from './event-bus';
import { EventStore } from './event-store';
import { JwtModule } from '@nestjs/jwt';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { SearchService } from './search.service';
import { ImageService } from './image.service';
import { GeoService } from './geo.service';
import { CategoryService } from './category.service';
import { MinioService } from './minio.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuditService } from './audit.service';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_super_secret_key_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ListingController],
  providers: [
    ListingService, 
    SearchService, 
    ImageService, 
    GeoService, 
    CategoryService, 
    MinioService,
    AuthGuard,
    TenantGuard,
    RolesGuard,
    EventBus,
    EventStore,
    AuditService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
  exports: [AuthGuard],
})
export class AppModule {}