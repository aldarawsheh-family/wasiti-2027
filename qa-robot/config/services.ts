export interface ServiceInfo {
  name: string;
  container: string;
  port: number;
  type: 'nestjs' | 'python' | 'infra';
  healthEndpoint?: string;
}

export const SERVICES: ServiceInfo[] = [
  { name: 'auth-service', container: 'wasity-auth', port: 3005, type: 'nestjs', healthEndpoint: '/health' },
  { name: 'user-service', container: 'wasity-user', port: 3001, type: 'nestjs' },
  { name: 'company-service', container: 'wasity-company', port: 3002, type: 'nestjs' },
  { name: 'listings-service', container: 'wasity-listings', port: 3004, type: 'nestjs' },
  { name: 'deals-service', container: 'wasity-deals', port: 3007, type: 'nestjs' },
  { name: 'chat-service', container: 'wasity-chat', port: 3008, type: 'nestjs' },
  { name: 'notification-service', container: 'wasity-notification', port: 3006, type: 'nestjs' },
  { name: 'wallet-service', container: 'wasity-wallet', port: 3009, type: 'nestjs' },
  { name: 'ai-service', container: 'wasity-ai', port: 8000, type: 'python', healthEndpoint: '/api/ai/docs' },
];

export const INFRA_SERVICES = [
  { name: 'api-gateway', container: 'wasity-gateway', port: 8080 },
  { name: 'frontend', container: 'wasity-frontend', port: 3000 },
  { name: 'postgres', container: 'wasity-postgres', port: 5432 },
  { name: 'postgres-slave', container: 'wasity-postgres-slave', port: 5433 },
  { name: 'redis', container: 'wasity-redis', port: 6379 },
  { name: 'rabbitmq', container: 'wasity-rabbitmq', port: 5672 },
  { name: 'minio', container: 'wasity-minio', port: 9000 },
  { name: 'prometheus', container: 'wasity-prometheus', port: 9090 },
  { name: 'grafana', container: 'wasity-grafana', port: 3030 },
];