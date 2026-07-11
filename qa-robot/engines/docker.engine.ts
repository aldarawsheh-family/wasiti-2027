
import { execSync } from 'child_process';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';
import { SERVICES, INFRA_SERVICES } from '../config/services';

export class DockerEngine {
  private reporter: Reporter;

  constructor(reporter: Reporter) {
    this.reporter = reporter;
  }

  async checkContainers(): Promise<void> {
    Logger.header('🐳 فحص حاويات Docker');

    const allServices = [...SERVICES, ...INFRA_SERVICES];

    for (const service of allServices) {
      try {
        const result = execSync(
          `docker inspect -f "{{.State.Status}}" ${service.container}`,
          { encoding: 'utf-8', timeout: 5000 }
        ).trim();

        const isRunning = result === 'running';

        this.reporter.addResult({
          test: `حاوية ${service.container}`,
          category: 'docker',
          passed: isRunning,
          expected: 'running',
          actual: result,
          severity: 'CRITICAL',
        });
      } catch (err: any) {
        this.reporter.addResult({
          test: `حاوية ${service.container}`,
          category: 'docker',
          passed: false,
          expected: 'موجودة وتعمل',
          actual: err.message?.substring(0, 50) || 'خطأ غير معروف',
          severity: 'CRITICAL',
        });
      }
    }
  }
}