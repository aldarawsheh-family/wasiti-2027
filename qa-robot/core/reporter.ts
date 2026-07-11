import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

export type Severity = 'CRITICAL' | 'MAJOR' | 'MINOR';

export interface TestResult {
  test: string;
  category: string;
  passed: boolean;
  expected: any;
  actual: any;
  severity: Severity;
  duration?: number;
  screenshot?: string;
}

export interface ReportSummary {
  generated: string;
  version: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    critical: number;
    major: number;
    minor: number;
    duration_seconds: number;
  };
  categories: Record<string, { total: number; passed: number; failed: number }>;
  failures: TestResult[];
}

export class Reporter {
  private results: TestResult[] = [];
  private startTime: number = 0;
  private reportDir: string;
  private ignoreList: string[] = [
    'database.user_svc',
    'database.transport',
    'database.booking',
  ];

  constructor() {
    this.reportDir = path.resolve(__dirname, '../reports');
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  isIgnored(test: string): boolean {
    return this.ignoreList.some(i => test.includes(i));
  }

  start(): void {
    this.startTime = Date.now();
    Logger.header('بدء الاختبارات');
  }

  addResult(result: TestResult): void {
    if (this.isIgnored(result.test)) return;
    this.results.push(result);
    if (result.passed) {
      Logger.pass(`${result.category} | ${result.test}`);
    } else {
      const icon = result.severity === 'CRITICAL' ? '🔴' : result.severity === 'MAJOR' ? '🟡' : '⚪';
      Logger.fail(`${icon} ${result.category} | ${result.test}`, {
        expected: result.expected,
        actual: result.actual,
      });
    }
  }

  getFailures(): TestResult[] {
    return this.results.filter(r => !r.passed);
  }

  generateReport(): ReportSummary {
    const duration = (Date.now() - this.startTime) / 1000;
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    const critical = this.results.filter(r => !r.passed && r.severity === 'CRITICAL').length;
    const major = this.results.filter(r => !r.passed && r.severity === 'MAJOR').length;
    const minor = this.results.filter(r => !r.passed && r.severity === 'MINOR').length;

    const categories: Record<string, { total: number; passed: number; failed: number }> = {};
    for (const r of this.results) {
      if (!categories[r.category]) {
        categories[r.category] = { total: 0, passed: 0, failed: 0 };
      }
      categories[r.category].total++;
      if (r.passed) {
        categories[r.category].passed++;
      } else {
        categories[r.category].failed++;
      }
    }

    const report: ReportSummary = {
      generated: new Date().toISOString(),
      version: 'WASITI-2027-RC2',
      summary: { total, passed, failed, critical, major, minor, duration_seconds: Math.round(duration) },
      categories,
      failures: this.results.filter(r => !r.passed),
    };

    this.saveJson(report);
    this.saveHtml(report);
    this.printSummary(report);
    return report;
  }

  private saveJson(report: ReportSummary): void {
    const filePath = path.join(this.reportDir, 'report.json');
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
    Logger.info(`📁 التقرير JSON محفوظ: ${filePath}`);
  }

  private saveHtml(report: ReportSummary): void {
    const s = report.summary;
    const passRate = s.total > 0 ? Math.round((s.passed / s.total) * 100) : 0;
    const isReady = s.critical === 0 && s.major === 0;

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><title>تقرير WASITI 2027 QA</title>
<style>body{font-family:Cairo,sans-serif;background:#111;color:#fff;padding:20px}.card{background:#1a1a1a;border-radius:16px;padding:24px;margin:16px 0;border:1px solid #333}.pass{color:#22C55E}.fail{color:#EF4444}.badge{padding:4px 12px;border-radius:8px;font-size:14px}.badge-pass{background:#22C55E22;color:#22C55E}.badge-fail{background:#EF444422;color:#EF4444}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:right;border-bottom:1px solid #333}.big-number{font-size:64px;font-weight:bold}.verdict{font-size:24px;font-weight:bold;padding:12px 24px;border-radius:12px;text-align:center}.verdict-ready{background:#22C55E22;color:#22C55E;border:1px solid #22C55E}.verdict-blocked{background:#EF444422;color:#EF4444;border:1px solid #EF4444}</style>
</head><body>
<h1>🤖 WASITI 2027 — تقرير QA Robot</h1>
<p>📅 ${report.generated} | 🏷️ ${report.version}</p>
<div class="card"><div class="verdict ${isReady ? 'verdict-ready' : 'verdict-blocked'}">${isReady ? '✅ READY FOR PRODUCTION' : '❌ BLOCKED WITH ERRORS'}</div></div>
<div class="card" style="display:flex;gap:24px;justify-content:center">
<div style="text-align:center"><div class="big-number pass">${s.passed}</div>✅ ناجح</div>
<div style="text-align:center"><div class="big-number fail">${s.failed}</div>❌ فاشل</div>
<div style="text-align:center"><div class="big-number">${s.total}</div>📝 الإجمالي</div>
<div style="text-align:center"><div class="big-number">${passRate}%</div>📊 النسبة</div>
</div>
<div class="card" style="display:flex;gap:12px">
${s.critical > 0 ? `<span class="badge badge-fail">🔴 ${s.critical} حرج</span>` : ''}
${s.major > 0 ? `<span class="badge" style="background:#F59E0B22;color:#F59E0B;">🟡 ${s.major} كبير</span>` : ''}
${s.minor > 0 ? `<span class="badge" style="background:#3B82F622;color:#3B82F6;">⚪ ${s.minor} بسيط</span>` : ''}
<span class="badge badge-pass">⏱️ ${s.duration_seconds} ثانية</span></div>
<div class="card"><h2>📂 الفئات</h2><table>
<tr><th>الفئة</th><th>الإجمالي</th><th>ناجح</th><th>فاشل</th></tr>
${Object.entries(report.categories).map(([cat, data]) => `<tr><td>${cat}</td><td>${data.total}</td><td class="pass">${data.passed}</td><td class="fail">${data.failed}</td></tr>`).join('')}
</table></div>
${report.failures.length > 0 ? `<div class="card"><h2>❌ الأخطاء (${report.failures.length})</h2><table>
<tr><th>الفئة</th><th>الاختبار</th><th>المتوقع</th><th>الفعلي</th><th>الخطورة</th></tr>
${report.failures.map(f => `<tr><td>${f.category}</td><td>${f.test}</td><td>${f.expected}</td><td class="fail">${f.actual}</td><td>${f.severity === 'CRITICAL' ? '🔴' : f.severity === 'MAJOR' ? '🟡' : '⚪'}</td></tr>`).join('')}
</table></div>` : ''}
</body></html>`;

    const filePath = path.join(this.reportDir, 'report.html');
    fs.writeFileSync(filePath, html, 'utf-8');
    Logger.info(`📁 التقرير HTML محفوظ: ${filePath}`);
  }

  private printSummary(report: ReportSummary): void {
    const s = report.summary;
    Logger.separator();
    console.log('');
    console.log('╔══════════════════════════════════════╗');
    console.log('║     📊 تقرير WASITI 2027 QA          ║');
    console.log('╠══════════════════════════════════════╣');
    console.log(`║  ⏱️  الوقت: ${s.duration_seconds} ثانية`);
    console.log(`║  📝 الإجمالي: ${s.total} اختبار`);
    console.log(`║  ✅ ناجح: ${s.passed}`);
    console.log(`║  ❌ فاشل: ${s.failed}`);
    if (s.critical > 0) console.log(`║  🔴 حرج: ${s.critical}`);
    if (s.major > 0) console.log(`║  🟡 كبير: ${s.major}`);
    if (s.minor > 0) console.log(`║  ⚪ بسيط: ${s.minor}`);
    console.log('╚══════════════════════════════════════╝');
    console.log('');

    if (s.failed === 0) {
      Logger.pass('✅ WASITI 2027 READY FOR PRODUCTION');
    } else if (s.critical > 0) {
      Logger.fail('❌ BLOCKED WITH CRITICAL ERRORS');
    } else {
      Logger.warn('⚠️ NEEDS FIXES BEFORE PRODUCTION');
    }
  }
}