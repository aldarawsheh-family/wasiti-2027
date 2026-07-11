import { execSync } from 'child_process';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';
import { PAGES } from '../config/pages';

export class DiscoveryEngine {
  private reporter: Reporter;
  private projectRoot: string;

  constructor(reporter: Reporter) {
    this.reporter = reporter;
    this.projectRoot = 'C:\\Users\\aaaaa\\Desktop\\wasity';
  }

  async discover(): Promise<void> {
    Logger.header('🔍 Discovery Engine');

    await this.discoverPages();
    await this.discoverControllers();
    await this.discoverDockerServices();
  }

  private async discoverPages(): Promise<void> {
    Logger.info('📄 فحص صفحات Next.js...');

    try {
      const result = execSync(
        `dir "${this.projectRoot}\\containers\\frontend\\src\\app" /s /b | findstr "page.tsx"`,
        { encoding: 'utf-8', timeout: 5000 }
      );

      const files = result.trim().split('\n');
      const discoveredPages: string[] = [];

      for (const file of files) {
        const match = file.match(/\[locale\]\\(.*)\\page\.tsx$/);
        if (match) {
          let route = match[1]
            .replace(/\\/g, '/')
            .replace(/\(/g, '')
            .replace(/\)/g, '');
          discoveredPages.push(`/ar/${route}`);
        }
      }

      const configuredPages = PAGES.map(p => p.path);
      const missingInConfig = discoveredPages.filter(p => !configuredPages.includes(p));
      const extraInConfig = configuredPages.filter(p => !discoveredPages.includes(p));

      this.reporter.addResult({
        test: 'Discovery: صفحات Next.js',
        category: 'discovery',
        passed: missingInConfig.length === 0,
        expected: 'كل الصفحات معروفة',
        actual: missingInConfig.length > 0 
          ? `غير معروفة: ${missingInConfig.join(', ')}` 
          : extraInConfig.length > 0 
            ? `صفحات زائدة في config: ${extraInConfig.join(', ')}`
            : 'متطابقة',
        severity: 'MAJOR',
      });

      if (missingInConfig.length > 0) {
        Logger.warn(`🆕 صفحات جديدة مكتشفة: ${missingInConfig.join(', ')}`);
      }
      if (extraInConfig.length > 0) {
        Logger.warn(`⚠️ صفحات في config غير موجودة: ${extraInConfig.join(', ')}`);
      }
    } catch (err: any) {
      this.reporter.addResult({
        test: 'Discovery: صفحات Next.js',
        category: 'discovery',
        passed: false,
        expected: 'قراءة الملفات',
        actual: err.message?.substring(0, 80),
        severity: 'CRITICAL',
      });
    }
  }

  private async discoverControllers(): Promise<void> {
    Logger.info('🎮 فحص Controllers...');

    try {
      const result = execSync(
        `dir "${this.projectRoot}\\services" /s /b | findstr "controller.ts"`,
        { encoding: 'utf-8', timeout: 5000 }
      );

      const files = result.trim().split('\n');
      const controllers: string[] = [];

      for (const file of files) {
        const match = file.match(/services\\([^\\]+)\\src\\/);
        if (match) {
          controllers.push(match[1]);
        }
      }

      const uniqueControllers = [...new Set(controllers)];

      this.reporter.addResult({
        test: 'Discovery: Controllers',
        category: 'discovery',
        passed: uniqueControllers.length > 0,
        expected: 'Controllers موجودة',
        actual: `${uniqueControllers.length} Controllers: ${uniqueControllers.slice(0, 5).join(', ')}...`,
        severity: 'MAJOR',
      });

      Logger.info(`🎮 ${uniqueControllers.length} Controllers مكتشفة`);
    } catch (err: any) {
      this.reporter.addResult({
        test: 'Discovery: Controllers',
        category: 'discovery',
        passed: false,
        expected: 'قراءة Controllers',
        actual: err.message?.substring(0, 80),
        severity: 'MAJOR',
      });
    }
  }

  private async discoverDockerServices(): Promise<void> {
    Logger.info('🐳 فحص docker-compose.yml...');

    try {
      const result = execSync(
        `type "${this.projectRoot}\\docker-compose.yml" | findstr "container_name:"`,
        { encoding: 'utf-8', timeout: 3000 }
      );

      const services = result
        .trim()
        .split('\n')
        .map(line => line.replace(/.*container_name:\s*/, '').trim())
        .filter(Boolean);

      this.reporter.addResult({
        test: 'Discovery: Docker Services',
        category: 'discovery',
        passed: services.length > 0,
        expected: 'خدمات Docker',
        actual: `${services.length} خدمات: ${services.join(', ')}`,
        severity: 'MAJOR',
      });

      Logger.info(`🐳 ${services.length} خدمات Docker مكتشفة`);
    } catch (err: any) {
      this.reporter.addResult({
        test: 'Discovery: Docker Services',
        category: 'discovery',
        passed: false,
        expected: 'قراءة docker-compose',
        actual: err.message?.substring(0, 50),
        severity: 'MAJOR',
      });
    }
  }
}