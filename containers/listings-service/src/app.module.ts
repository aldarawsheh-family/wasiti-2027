// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
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
  ],
  exports: [AuthGuard],
})
export class AppModule {}