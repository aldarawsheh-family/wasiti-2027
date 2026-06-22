// ══════════════════════════════════════════════════
// WASITI 2027 — Auth Service — Main
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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🔐 Auth Service running on port ${port}`);
}

bootstrap();