// ══════════════════════════════════════════════════
// WASITI 2027 — Deals Service — Main
// ══════════════════════════════════════════════════

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`🤝 Deals Service running on port ${port}`);
}

bootstrap();