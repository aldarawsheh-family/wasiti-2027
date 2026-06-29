import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({ origin: process.env.CORS_ORIGINS?.split(',') || '*', methods: 'GET,POST,PUT,DELETE,PATCH', credentials: true });
  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`📦 Listings Service running on port ${port}`);
}

bootstrap();
