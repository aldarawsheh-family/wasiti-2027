// ══════════════════════════════════════════════════
// WASITI 2027 — Notification Service — Main
// ══════════════════════════════════════════════════

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*', methods: 'GET,POST', credentials: true });
  const port = process.env.PORT || 3006;
  await app.listen(port);
  console.log(`🔔 Notification Service running on port ${port}`);
}
bootstrap();