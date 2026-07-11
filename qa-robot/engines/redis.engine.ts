import { execSync } from 'child_process';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';

export class RedisEngine {
  private reporter: Reporter;

  constructor(reporter: Reporter) {
    this.reporter = reporter;
  }

  private redis(cmd: string): string {
    return execSync(
      `docker exec wasity-redis redis-cli ${cmd}`,
      { encoding: 'utf-8', timeout: 3000 }
    ).trim();
  }

  async checkRedis(): Promise<void> {
    Logger.header('📡 فحص Redis');

    // 1. Connection
    try {
      const ping = this.redis('PING');
      this.reporter.addResult({
        test: 'الاتصال بـ Redis',
        category: 'redis',
        passed: ping === 'PONG',
        expected: 'PONG',
        actual: ping,
        severity: 'CRITICAL',
      });
    } catch (err: any) {
      this.reporter.addResult({
        test: 'الاتصال بـ Redis',
        category: 'redis',
        passed: false,
        expected: 'PONG',
        actual: err.message?.substring(0, 50),
        severity: 'CRITICAL',
      });
    }

    // 2. Blacklist keys
    try {
      const blacklist = this.redis('KEYS blacklist:*');
      const count = blacklist ? blacklist.split('\n').length : 0;
      this.reporter.addResult({
        test: 'Token Blacklist',
        category: 'redis',
        passed: true,
        expected: 'نظام blacklist موجود',
        actual: `${count} توكن مدرج`,
        severity: 'MINOR',
      });
    } catch (err: any) {
      this.reporter.addResult({
        test: 'Token Blacklist',
        category: 'redis',
        passed: false,
        expected: 'نظام blacklist موجود',
        actual: err.message?.substring(0, 50),
        severity: 'MAJOR',
      });
    }

    // 3. Permissions cache
    try {
      const perms = this.redis('KEYS permissions:*');
      const count = perms ? perms.split('\n').length : 0;
      this.reporter.addResult({
        test: 'Permissions Cache',
        category: 'redis',
        passed: true,
        expected: 'نظام permissions موجود',
        actual: `${count} صلاحية مخزنة`,
        severity: 'MINOR',
      });
    } catch (err: any) {
      this.reporter.addResult({
        test: 'Permissions Cache',
        category: 'redis',
        passed: false,
        expected: 'نظام permissions موجود',
        actual: err.message?.substring(0, 50),
        severity: 'MAJOR',
      });
    }
  }
}