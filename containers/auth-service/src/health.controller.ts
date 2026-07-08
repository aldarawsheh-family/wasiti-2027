import { Controller, Get } from '@nestjs/common';
import { HealthAggregatorService } from './common/services/health-aggregator.service';

@Controller('system')
export class HealthController {
  constructor(private readonly healthService: HealthAggregatorService) {}

  @Get('health')
  async getHealth() {
    return this.healthService.getHealthStatus();
  }
}