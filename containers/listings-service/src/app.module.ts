// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { SearchService } from './search.service';
import { ImageService } from './image.service';
import { GeoService } from './geo.service';
import { CategoryService } from './category.service';
import { MinioService } from './minio.service';

@Module({
  imports: [],
  controllers: [ListingController],
  providers: [ListingService, SearchService, ImageService, GeoService, CategoryService, MinioService],
})
export class AppModule {}