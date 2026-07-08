import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthAggregatorService {
  private services = [
    { name: 'Auth Service', host: 'wasity-auth', port: 3005 },
    { name: 'User Service', host: 'wasity-user', port: 3001 },
    { name: 'Listings Service', host: 'wasity-listings', port: 3004 },
    { name: 'Deals Service', host: 'wasity-deals', port: 3005 },
    { name: 'Wallet Service', host: 'wasity-wallet', port: 3009 },
    { name: 'Company Service', host: 'wasity-company', port: 3002 },
    { name: 'Chat Service', host: 'wasity-chat', port: 3004 },
    { name: 'Notification Service', host: 'wasity-notification', port: 3006 },
    { name: 'AI Service', host: 'wasity-ai', port: 8000 },
  ];

  async getHealthStatus() {
    const results = await Promise.all(
      this.services.map(async (s) => {
        const start = Date.now();
        try {
          const res = await fetch(`http://${s.host}:${s.port}/health`);
          return { name: s.name, status: res.ok ? 'UP' : 'DOWN', responseTimeMs: Date.now() - start };
        } catch {
          return { name: s.name, status: 'DOWN', responseTimeMs: -1 };
        }
      })
    );
    return results;
  }
}