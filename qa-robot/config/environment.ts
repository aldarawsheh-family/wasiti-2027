import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  GATEWAY_URL: process.env.GATEWAY_URL || 'http://localhost:8080',
  HEALTH_URL: process.env.HEALTH_URL || 'http://localhost:8080/health',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://wasity:wasity_password_2027@localhost:5432/wasity',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST || 'localhost',
  RABBITMQ_PORT: Number(process.env.RABBITMQ_PORT) || 5672,
  RABBITMQ_USER: process.env.RABBITMQ_USER || 'wasity',
  RABBITMQ_PASS: process.env.RABBITMQ_PASS || 'wasity_rabbit_2027',
  DOCKER_SOCKET: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  DEFAULT_TENANT_ID: process.env.DEFAULT_TENANT_ID || '00000000-0000-0000-0000-000000000001',
};