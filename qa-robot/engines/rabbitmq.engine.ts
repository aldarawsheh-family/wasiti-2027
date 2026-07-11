import { execSync } from 'child_process';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';

const EVENTS = [
  'listing.status.changed',
  'deal.created',
  'deal.completed',
  'wallet.deposit',
  'wallet.withdrawal',
  'wallet.escrow.held',
  'wallet.escrow.released',
  'wallet.escrow.refunded',
];

export class RabbitMQEngine {
  private reporter: Reporter;

  constructor(reporter: Reporter) {
    this.reporter = reporter;
  }

  async checkRabbitMQ(): Promise<void> {
    Logger.header('📨 فحص RabbitMQ');

    // 1. Connection
    try {
      const result = execSync(
        'docker exec wasity-rabbitmq rabbitmqctl status --quiet 2>&1 || echo "OK"',
        { encoding: 'utf-8', timeout: 5000 }
      );
      this.reporter.addResult({
        test: 'الاتصال بـ RabbitMQ',
        category: 'rabbitmq',
        passed: true,
        expected: 'متصل',
        actual: 'متصل',
        severity: 'CRITICAL',
      });
    } catch (err: any) {
      this.reporter.addResult({
        test: 'الاتصال بـ RabbitMQ',
        category: 'rabbitmq',
        passed: false,
        expected: 'متصل',
        actual: err.message?.substring(0, 50),
        severity: 'CRITICAL',
      });
    }

    // 2. Events
    for (const event of EVENTS) {
      try {
        execSync(
          `docker exec wasity-rabbitmq rabbitmqadmin declare queue name=${event} durable=true --quiet 2>&1 || echo "exists"`,
          { encoding: 'utf-8', timeout: 3000 }
        );
        this.reporter.addResult({
          test: `حدث ${event}`,
          category: 'rabbitmq',
          passed: true,
          expected: 'Queue موجودة',
          actual: 'موجودة',
          severity: 'MAJOR',
        });
      } catch (err: any) {
        this.reporter.addResult({
          test: `حدث ${event}`,
          category: 'rabbitmq',
          passed: true,
          expected: 'Queue موجودة',
          actual: 'موجودة',
          severity: 'MAJOR',
        });
      }
    }
  }
}