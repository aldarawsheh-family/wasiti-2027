import { execSync } from 'child_process';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';

const SCHEMAS = [
  'auth', 'user_svc', 'company', 'listing', 'deal',
  'chat', 'notification', 'transport', 'booking', 'wallet', 'billing',
];

export class DatabaseEngine {
  private reporter: Reporter;

  constructor(reporter: Reporter) {
    this.reporter = reporter;
  }

  private query(sql: string): string {
    return execSync(
      `docker exec wasity-postgres psql -U wasity -d wasity -t -c "${sql}"`,
      { encoding: 'utf-8', timeout: 5000 }
    ).trim();
  }

  async checkDatabase(): Promise<void> {
    Logger.header('🗄️ فحص قاعدة البيانات');

    try {
      this.query('SELECT 1');
      this.reporter.addResult({
        test: 'الاتصال بقاعدة البيانات',
        category: 'database',
        passed: true,
        expected: 'متصل',
        actual: 'متصل',
        severity: 'CRITICAL',
      });
    } catch (err: any) {
      this.reporter.addResult({
        test: 'الاتصال بقاعدة البيانات',
        category: 'database',
        passed: false,
        expected: 'متصل',
        actual: err.message?.substring(0, 80),
        severity: 'CRITICAL',
      });
    }

    for (const schema of SCHEMAS) {
      try {
        const result = this.query(
          `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${schema}'`
        );
        const tableCount = parseInt(result) || 0;
        this.reporter.addResult({
          test: `Schema ${schema}`,
          category: 'database',
          passed: tableCount > 0,
          expected: 'جداول موجودة',
          actual: `${tableCount} جداول`,
          severity: 'MAJOR',
        });
      } catch (err: any) {
        this.reporter.addResult({
          test: `Schema ${schema}`,
          category: 'database',
          passed: false,
          expected: 'موجود',
          actual: err.message?.substring(0, 50),
          severity: 'MAJOR',
        });
      }
    }
  }
}