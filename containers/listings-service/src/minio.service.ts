// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — Minio Service
// ══════════════════════════════════════════════════

import { Injectable, OnModuleInit } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class MinioService implements OnModuleInit {
  private s3: S3Client;

  async onModuleInit() {
    this.s3 = new S3Client({
      endpoint: `http://${process.env.MINIO_ENDPOINT || 'minio:9000'}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ROOT_USER || 'wasity_admin',
        secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'wasity_minio_secret',
      },
      forcePathStyle: true,
    });
  }

  async upload(bucket: string, key: string, body: Buffer, contentType: string): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  }

  async delete(bucket: string, key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }
}