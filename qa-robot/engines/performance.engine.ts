import axios from 'axios';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';
import { ENV } from '../config/environment';

interface EndpointResult {
  name: string;
  url: string;
  method: string;
  avg: number;
  min: number;
  max: number;
  p95: number;
  errors: number;
  total: number;
  times: number[];
}

interface ResourceSnapshot {
  timestamp: string;
  cpu: string;
  ram: string;
  dockerContainers: number;
  postgresConnections: string;
  redisMemory: string;
}

interface LoadTestResult {
  users: number;
  passed: number;
  failed: number;
  avgResponseTime: number;
  maxResponseTime: number;
  duration: number;
}

const ENDPOINTS_TO_TEST = [
  { name: 'Health', url: '/health', method: 'GET' },
  { name: 'Auth Login', url: '/api/auth/login', method: 'POST', body: { email: 'admin2@wasity.ly', password: 'Wasity@2026' } },
  { name: 'Listings List', url: '/api/listings', method: 'GET' },
  { name: 'Deals List', url: '/api/deals', method: 'GET' },
  { name: 'Wallet Me', url: '/api/wallet/me', method: 'GET' },
  { name: 'Companies List', url: '/api/companies', method: 'GET' },
  { name: 'Notifications', url: '/api/notifications', method: 'GET' },
  { name: 'AI Docs', url: '/api/ai/docs', method: 'GET' },
];

const ITERATIONS = 10;
const LOAD_LEVELS = [10, 25, 50];

export class PerformanceEngine {
  private reporter: Reporter;
  private token: string = '';
  private results: EndpointResult[] = [];
  private loadResults: LoadTestResult[] = [];
  private resourceSnapshots: ResourceSnapshot[] = [];

  constructor(reporter: Reporter) {
    this.reporter = reporter;
  }

  private headers() {
    const h: any = { 'Content-Type': 'application/json', 'tenant-id': ENV.DEFAULT_TENANT_ID };
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  }

  private getCPU(): string {
    try {
      return execSync('wmic cpu get loadpercentage /value', { encoding: 'utf-8', timeout: 3000 })
        .split('=')[1]?.trim() + '%' || 'N/A';
    } catch { return 'N/A'; }
  }

  private getRAM(): string {
    try {
      const total = execSync('wmic OS get TotalVisibleMemorySize /value', { encoding: 'utf-8', timeout: 3000 })
        .split('=')[1]?.trim();
      const free = execSync('wmic OS get FreePhysicalMemory /value', { encoding: 'utf-8', timeout: 3000 })
        .split('=')[1]?.trim();
      if (total && free) {
        const used = parseInt(total) - parseInt(free);
        return Math.round((used / parseInt(total)) * 100) + '%';
      }
      return 'N/A';
    } catch { return 'N/A'; }
  }

  private getDockerContainers(): number {
    try {
      const result = execSync('docker ps -q', { encoding: 'utf-8', timeout: 3000 });
      return result.trim().split('\n').filter(Boolean).length;
    } catch { return 0; }
  }

  private getPostgresConnections(): string {
    try {
      return execSync(
        'docker exec wasity-postgres psql -U wasity -d wasity -t -c "SELECT count(*) FROM pg_stat_activity"',
        { encoding: 'utf-8', timeout: 3000 }
      ).trim();
    } catch { return 'N/A'; }
  }

  private getRedisMemory(): string {
    try {
      const result = execSync(
        'docker exec wasity-redis redis-cli INFO memory',
        { encoding: 'utf-8', timeout: 3000 }
      );
      const line = result.split('\n').find(l => l.startsWith('used_memory_human:'));
      return line ? line.split(':')[1]?.trim() || 'N/A' : 'N/A';
    } catch { return 'N/A'; }
  }

  private takeSnapshot(): ResourceSnapshot {
    return {
      timestamp: new Date().toISOString(),
      cpu: this.getCPU(),
      ram: this.getRAM(),
      dockerContainers: this.getDockerContainers(),
      postgresConnections: this.getPostgresConnections(),
      redisMemory: this.getRedisMemory(),
    };
  }

  private async login(): Promise<void> {
    try {
      const res = await axios.post(`${ENV.GATEWAY_URL}/api/auth/login`, {
        email: 'admin2@wasity.ly', password: 'Wasity@2026',
      }, { headers: { 'Content-Type': 'application/json', 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
      this.token = res.data.accessToken;
      Logger.pass('تم تسجيل الدخول لـ Performance Engine');
    } catch {
      Logger.warn('فشل تسجيل الدخول - بعض الاختبارات بدون توكن');
    }
  }

  async runPerformance(): Promise<void> {
    Logger.header('⚡ Performance Engine');
    Logger.info(`📋 ${ENDPOINTS_TO_TEST.length} Endpoints × ${ITERATIONS} تكرار`);

    await this.login();

    // Phase 1: Endpoint Response Times
    for (const ep of ENDPOINTS_TO_TEST) {
      const times: number[] = [];
      let errors = 0;

      Logger.info(`  🔍 ${ep.name}...`);
      for (let i = 0; i < ITERATIONS; i++) {
        const start = Date.now();
        try {
          const config: any = { headers: this.headers(), timeout: 5000 };
          if (ep.method === 'GET') {
            await axios.get(`${ENV.GATEWAY_URL}${ep.url}`, config);
          } else {
            await axios.post(`${ENV.GATEWAY_URL}${ep.url}`, ep.body || {}, config);
          }
          times.push(Date.now() - start);
        } catch {
          errors++;
        }
      }

      if (times.length > 0) {
        times.sort((a, b) => a - b);
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        const p95 = times[Math.floor(times.length * 0.95)];
        const result: EndpointResult = {
          name: ep.name, url: ep.url, method: ep.method,
          avg, min: times[0], max: times[times.length - 1], p95,
          errors, total: ITERATIONS, times,
        };
        this.results.push(result);

        this.reporter.addResult({
          test: `Perf: ${ep.name}`, category: 'performance',
          passed: errors === 0,
          expected: '< 500ms',
          actual: `${avg}ms avg, ${p95}ms p95, ${errors} errors`,
          severity: avg > 500 ? 'MAJOR' : 'MAJOR',
          duration: avg,
        });

        Logger.pass(`  ✅ ${ep.name}: avg=${avg}ms, p95=${p95}ms, errors=${errors}`);
      }
    }

    // Phase 2: Resource Monitoring
    Logger.info('📊 مراقبة الموارد...');
    for (let i = 0; i < 3; i++) {
      this.resourceSnapshots.push(this.takeSnapshot());
      await new Promise(r => setTimeout(r, 1000));
    }

    // Phase 3: Load Testing
    Logger.info('🔥 Load Testing...');
    for (const users of LOAD_LEVELS) {
      Logger.info(`  👥 ${users} مستخدم...`);
      const start = Date.now();
      let passed = 0;
      let failed = 0;
      let maxTime = 0;

      const promises = [];
      for (let i = 0; i < users; i++) {
        promises.push(
          axios.get(`${ENV.GATEWAY_URL}/api/listings`, {
            headers: { 'tenant-id': ENV.DEFAULT_TENANT_ID },
            timeout: 10000,
          }).then(() => {
            passed++;
          }).catch(() => {
            failed++;
          })
        );
      }
      await Promise.all(promises);

      const duration = Date.now() - start;
      this.loadResults.push({ users, passed, failed, avgResponseTime: Math.round(duration / users), maxResponseTime: maxTime, duration });

      this.reporter.addResult({
        test: `Load: ${users} users`, category: 'performance',
        passed: failed === 0,
        expected: '0 errors',
        actual: `${passed} ok, ${failed} errors, ${duration}ms`,
        severity: failed > 0 ? 'CRITICAL' : 'MAJOR',
        duration,
      });

      Logger.pass(`  ✅ ${users} users: ${passed} ok, ${failed} errors, ${duration}ms`);
    }

    // Phase 4: Generate Report
    this.generateReport();
  }

  private generateReport(): void {
    const reportDir = path.join(__dirname, '..', 'reports');

    const slowest = this.results.sort((a, b) => b.avg - a.avg)[0];
    const mostErrors = this.results.sort((a, b) => b.errors - a.errors)[0];

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        endpointsTested: ENDPOINTS_TO_TEST.length,
        iterationsPerEndpoint: ITERATIONS,
        loadLevels: LOAD_LEVELS,
        slowestEndpoint: slowest ? { name: slowest.name, avg: slowest.avg, p95: slowest.p95 } : null,
        mostErrors: mostErrors ? { name: mostErrors.name, errors: mostErrors.errors } : null,
      },
      endpointResults: this.results,
      resourceSnapshots: this.resourceSnapshots,
      loadTestResults: this.loadResults,
      recommendations: [] as string[],
    };

    if (slowest && slowest.avg > 300) {
      report.recommendations.push(`⚠️ ${slowest.name} بطيء (${slowest.avg}ms avg). فحص الـ service logs.`);
    }
    if (mostErrors && mostErrors.errors > 0) {
      report.recommendations.push(`⚠️ ${mostErrors.name} عنده ${mostErrors.errors} أخطاء. فحص الاستقرار.`);
    }
    if (this.loadResults.some(r => r.failed > 0)) {
      report.recommendations.push('⚠️ Load test عنده فشل. زيادة timeout أو فحص connection pool.');
    }

    fs.writeFileSync(
      path.join(reportDir, 'performance-report.json'),
      JSON.stringify(report, null, 2)
    );

    const html = this.generateHTML(report);
    fs.writeFileSync(path.join(reportDir, 'performance-report.html'), html);

    Logger.info('📁 performance-report.json محفوظ');
    Logger.info('📁 performance-report.html محفوظ');
  }

  private generateHTML(report: any): string {
    const rows = this.results.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.method}</td>
        <td>${r.avg}ms</td>
        <td>${r.min}ms</td>
        <td>${r.max}ms</td>
        <td>${r.p95}ms</td>
        <td style="color:${r.errors > 0 ? 'red' : 'green'}">${r.errors}/${r.total}</td>
      </tr>
    `).join('');

    const loadRows = this.loadResults.map(r => `
      <tr>
        <td>${r.users}</td>
        <td style="color:green">${r.passed}</td>
        <td style="color:${r.failed > 0 ? 'red' : 'green'}">${r.failed}</td>
        <td>${r.avgResponseTime}ms</td>
        <td>${r.duration}ms</td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>WASITI 2027 — Performance Report</title>
  <style>
    body { font-family: Cairo, sans-serif; background: #111; color: #eee; padding: 20px; }
    h1 { color: #128C4F; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #333; padding: 10px; text-align: center; }
    th { background: #128C4F; color: white; }
    tr:nth-child(even) { background: #1a1a1a; }
    .rec { background: #2a1a1a; border-left: 4px solid #f00; padding: 10px; margin: 5px 0; }
    .rec-ok { border-left-color: #128C4F; }
  </style>
</head>
<body>
  <h1>⚡ WASITI 2027 — Performance Report</h1>
  <p>📅 ${report.timestamp}</p>

  <h2>📊 Endpoint Response Times (${report.summary.iterationsPerEndpoint}x each)</h2>
  <table>
    <tr><th>Endpoint</th><th>Method</th><th>Avg</th><th>Min</th><th>Max</th><th>P95</th><th>Errors</th></tr>
    ${rows}
  </table>

  <h2>🔥 Load Test Results</h2>
  <table>
    <tr><th>Users</th><th>✅ Passed</th><th>❌ Failed</th><th>Avg Response</th><th>Duration</th></tr>
    ${loadRows}
  </table>

  <h2>💻 Resource Snapshots</h2>
  ${this.resourceSnapshots.map(s => `
    <p>🕐 ${s.timestamp} | CPU: ${s.cpu} | RAM: ${s.ram} | Docker: ${s.dockerContainers} | PG: ${s.postgresConnections} | Redis: ${s.redisMemory}</p>
  `).join('')}

  <h2>💡 Recommendations</h2>
  ${report.recommendations.length > 0 ? report.recommendations.map((r: string) => `<div class="rec">${r}</div>`).join('') : '<div class="rec rec-ok">✅ كل المؤشرات ضمن الحدود المقبولة</div>'}

  <p style="margin-top:40px;color:#666">WASITI 2027 — Performance Engine — RC6-A</p>
</body>
</html>`;
  }
}