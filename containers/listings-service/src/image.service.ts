// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — Image Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  private readonly bucket = process.env.MINIO_BUCKET || 'wasity-images';

  constructor(private readonly minio: MinioService) {}

  async upload(listingId: string, file: Buffer, index: number): Promise<string> {
    const compressed = await this.compress(file);

    // رفع 3 نسخ
    const sizes = [
      { suffix: '', width: 1200 },
      { suffix: '_medium', width: 800 },
      { suffix: '_thumb', width: 400 },
    ];

    for (const size of sizes) {
      const resized = await sharp(compressed)
        .resize(size.width)
        .webp({ quality: 80 })
        .toBuffer();

      const key = `listings/${listingId}/${String(index).padStart(3, '0')}${size.suffix}.webp`;

      await this.minio.upload(this.bucket, key, resized, 'image/webp');
    }

    return `${String(index).padStart(3, '0')}.webp`;
  }

  async delete(listingId: string, filename: string): Promise<void> {
    const suffixes = ['', '_medium', '_thumb'];
    const name = filename.replace('.webp', '');

    for (const suffix of suffixes) {
      const key = `listings/${listingId}/${name}${suffix}.webp`;
      await this.minio.delete(this.bucket, key);
    }
  }

  async deleteAll(listingId: string, images: string[]): Promise<void> {
    for (const img of images) {
      await this.delete(listingId, img);
    }
  }

  getUrl(listingId: string, filename: string, size: 'original' | 'medium' | 'thumb' = 'medium'): string {
    const suffix = size === 'original' ? '' : size === 'medium' ? '_medium' : '_thumb';
    const name = filename.replace('.webp', '');
    const publicUrl = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
    return `${publicUrl}/${this.bucket}/listings/${listingId}/${name}${suffix}.webp`;
  }

  private async compress(file: Buffer): Promise<Buffer> {
    return sharp(file)
      .webp({ quality: 85 })
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();
  }
}