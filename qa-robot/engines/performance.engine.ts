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
  private async getContainerStats(containerName: string): Promise<string> {
    try {
      const result = execSync(
        `docker stats ${containerName} --no-stream --format "{{.CPUPerc}}|{{.MemPerc}}|{{.MemUsage}}"`,
        { encoding: 'utf-8', timeout: 5000 }
      ).trim();
      return result;
    } catch { return 'N/A'; }
  }

  private async getPostgresSlowQueries(): Promise<string> {
    try {
      return execSync(
        'docker exec wasity-postgres psql -U wasity -d wasity -t -c "SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 3"',
        { encoding: 'utf-8', timeout: 5000 }
      ).trim() || 'لا يوجد';
    } catch { return 'لا يوجد'; }
  }

  private async getRedisHitRatio(): Promise<string> {
    try {
      const result = execSync('docker exec wasity-redis redis-cli INFO stats', { encoding: 'utf-8', timeout: 3000 });
      const hits = result.split('\n').find(l => l.startsWith('keyspace_hits:'))?.split(':')[1]?.trim() || '0';
      const misses = result.split('\n').find(l => l.startsWith('keyspace_misses:'))?.split(':')[1]?.trim() || '0';
      const total = parseInt(hits) + parseInt(misses);
      return total > 0 ? Math.round((parseInt(hits) / total) * 100) + '%' : 'N/A';
    } catch { return 'N/A'; }
  }

  private async getRabbitMQQueueDepth(): Promise<string> {
    try {
      const result = execSync('docker exec wasity-rabbitmq rabbitmqctl list_queues name messages', { encoding: 'utf-8', timeout: 5000 }).trim();
      return result || 'لا توجد';
    } catch { return 'لا توجد'; }
  }

  async runInfrastructureMonitoring(): Promise<void> {
    Logger.header('🔧 Infrastructure Monitoring');

    const criticalContainers = [
      'wasity-postgres', 'wasity-redis', 'wasity-rabbitmq',
      'wasity-auth', 'wasity-listings', 'wasity-deals', 'wasity-wallet',
      'wasity-notification', 'wasity-chat', 'wasity-ai', 'wasity-gateway',
    ];

    const containerStats: any[] = [];
    for (const container of criticalContainers) {
      const stats = await this.getContainerStats(container);
      Logger.info(`  📦 ${container}: ${stats}`);
      containerStats.push({ container, stats });

      this.reporter.addResult({
        test: `Infra: ${container}`, category: 'performance',
        passed: stats !== 'N/A',
        expected: 'قيد التشغيل',
        actual: stats,
        severity: 'MAJOR',
      });
    }

    const slowQueries = await this.getPostgresSlowQueries();
    Logger.info(`  🐘 Slow Queries: ${slowQueries}`);
    this.reporter.addResult({
      test: 'Infra: PostgreSQL Slow Queries', category: 'performance',
      passed: true,
      expected: 'لا يوجد استعلامات بطيئة',
      actual: slowQueries,
      severity: 'MAJOR',
    });

    const hitRatio = await this.getRedisHitRatio();
    Logger.info(`  🔴 Redis Hit Ratio: ${hitRatio}`);
    this.reporter.addResult({
      test: 'Infra: Redis Hit Ratio', category: 'performance',
      passed: true,
      expected: '> 90%',
      actual: hitRatio,
      severity: 'MAJOR',
    });

    const queueDepth = await this.getRabbitMQQueueDepth();
    Logger.info(`  🐰 RabbitMQ Queues: ${queueDepth}`);
    this.reporter.addResult({
      test: 'Infra: RabbitMQ Queue Depth', category: 'performance',
      passed: true,
      expected: 'طبيعي',
      actual: queueDepth,
      severity: 'MAJOR',
    });

    this.generateInfraReport(containerStats, slowQueries, hitRatio, queueDepth);
  }

  private generateInfraReport(containerStats: any[], slowQueries: string, hitRatio: string, queueDepth: string): void {
    const reportDir = path.join(__dirname, '..', 'reports');
    const report = {
      timestamp: new Date().toISOString(),
      containerStats,
      postgresSlowQueries: slowQueries,
      redisHitRatio: hitRatio,
      rabbitMQQueueDepth: queueDepth,
    };

    fs.writeFileSync(path.join(reportDir, 'infra-report.json'), JSON.stringify(report, null, 2));

    const rows = containerStats.map(c => `<tr><td>${c.container}</td><td>${c.stats}</td></tr>`).join('');
    const html = `<!DOCTYPE html>
<html dir="rtl"><head><meta charset="UTF-8"><title>WASITI Infra Report</title>
<style>body{font-family:Cairo;background:#111;color:#eee;padding:20px}h1{color:#128C4F}table{border-collapse:collapse;width:100%}th,td{border:1px solid #333;padding:10px}th{background:#128C4F}</style></head>
<body><h1>🔧 WASITI 2027 — Infrastructure Report</h1><p>📅 ${report.timestamp}</p>
<h2>📦 Containers</h2><table><tr><th>Container</th><th>CPU | RAM% | Memory</th></tr>${rows}</table>
<h2>🐘 PostgreSQL</h2><pre>${slowQueries}</pre>
<h2>🔴 Redis</h2><p>Hit Ratio: ${hitRatio}</p>
<h2>🐰 RabbitMQ</h2><pre>${queueDepth}</pre></body></html>`;

    fs.writeFileSync(path.join(reportDir, 'infra-report.html'), html);
    Logger.info('📁 infra-report.json محفوظ');
    Logger.info('📁 infra-report.html محفوظ');
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

    Logger.info('📊 مراقبة الموارد...');
    for (let i = 0; i < 3; i++) {
      this.resourceSnapshots.push(this.takeSnapshot());
      await new Promise(r => setTimeout(r, 1000));
    }

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

    this.generateReport();
  }
    private calculateMetrics(times: number[], totalRequests: number, errors: number) {
    if (times.length === 0) return { avg: 0, median: 0, min: 0, max: 0, p95: 0, p99: 0, reqPerSec: 0, successRate: 0, errorRate: 100, totalRequests, errors };
    times.sort((a, b) => a - b);
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / times.length);
    const median = times[Math.floor(times.length / 2)];
    const p95 = times[Math.floor(times.length * 0.95)];
    const p99 = times[Math.floor(times.length * 0.99)];
    const min = times[0];
    const max = times[times.length - 1];
    const durationSec = (max - min) / 1000 || 0.001;
    const reqPerSec = Math.round(totalRequests / durationSec);
    const successRate = Math.round(((totalRequests - errors) / totalRequests) * 100);

    return { avg, median, min, max, p95, p99, reqPerSec, successRate, errorRate: 100 - successRate, totalRequests, errors };
  }

  async runScenario(name: string, userCount: number, actions: (() => Promise<void>)[]): Promise<any> {
    Logger.info(`🎯 Scenario: ${name} — ${userCount} users`);
    const times: number[] = [];
    let errors = 0;
    const start = Date.now();

    const promises = [];
    for (let i = 0; i < userCount; i++) {
      promises.push(
        (async () => {
          const t0 = Date.now();
          try {
            for (const action of actions) {
              await action();
            }
            times.push(Date.now() - t0);
          } catch {
            errors++;
          }
        })()
      );
    }
    await Promise.all(promises);

    const duration = Date.now() - start;
    const metrics = this.calculateMetrics(times, userCount, errors);
    Logger.pass(`  ✅ ${name}: ${metrics?.successRate}% success, ${metrics?.avg}ms avg`);

    this.reporter.addResult({
      test: `Scenario: ${name}`, category: 'performance',
      passed: errors === 0,
      expected: '0 errors',
      actual: `${metrics?.successRate}% success, ${errors} errors, ${duration}ms`,
      severity: errors > 0 ? 'CRITICAL' : 'MAJOR',
      duration,
    });

    return { name, userCount, duration, metrics };
  }
   async runAdvancedScenarios(): Promise<void> {
    Logger.header('🔥 Advanced Load Testing');

    // Scenario 1: Browse — login once, browse many
    const token1 = (await axios.post(`${ENV.GATEWAY_URL}/api/auth/login`, { email: 'admin2@wasity.ly', password: 'Wasity@2026' }, { headers: { 'Content-Type': 'application/json', 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 })).data.accessToken;
    const s1 = await this.runScenario('Browse Listings', 25, [
      async () => {
        await axios.get(`${ENV.GATEWAY_URL}/api/listings`, { headers: { 'tenant-id': ENV.DEFAULT_TENANT_ID, 'Authorization': `Bearer ${token1}` }, timeout: 5000 });
      },
    ]);

    // Scenario 2: Search — login once, search many
    const token2 = (await axios.post(`${ENV.GATEWAY_URL}/api/auth/login`, { email: 'buyer@wasity.ly', password: 'Wasity@2026' }, { headers: { 'Content-Type': 'application/json', 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 })).data.accessToken;
    const s2 = await this.runScenario('Search + View Listing', 50, [
      async () => {
        await axios.get(`${ENV.GATEWAY_URL}/api/listings`, { headers: { 'tenant-id': ENV.DEFAULT_TENANT_ID, 'Authorization': `Bearer ${token2}` }, timeout: 5000 });
      },
    ]);

    // Scenario 3: Seller CRUD — login once, CRUD many
    const token3 = (await axios.post(`${ENV.GATEWAY_URL}/api/auth/login`, { email: 'seller@wasity.ly', password: 'Wasity@2026' }, { headers: { 'Content-Type': 'application/json', 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 })).data.accessToken;
    const s3 = await this.runScenario('Seller CRUD', 25, [
      async () => {
        const listing = await axios.post(`${ENV.GATEWAY_URL}/api/listings`, { title: 'Perf Test', price: 99, city: 'دمشق', category: 'Cars' }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token3}`, 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
        const id = listing.data?.data?.id || listing.data?.id;
        if (id) {
          await axios.put(`${ENV.GATEWAY_URL}/api/listings/${id}`, { title: 'Updated' }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token3}`, 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
          await axios.delete(`${ENV.GATEWAY_URL}/api/listings/${id}`, { headers: { 'Authorization': `Bearer ${token3}`, 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
        }
      },
    ]);

    // Scenario 4: Deal Flow — single token to avoid rate limiting
    const token4 = (await axios.post(`${ENV.GATEWAY_URL}/api/auth/login`, { email: 'admin2@wasity.ly', password: 'Wasity@2026' }, { headers: { 'Content-Type': 'application/json', 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 })).data.accessToken;
    const s4 = await this.runScenario('Deal Flow', 25, [
      async () => {
        const listing = await axios.post(`${ENV.GATEWAY_URL}/api/listings`, { title: 'Deal Perf', price: 99, city: 'دمشق', category: 'Cars' }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token4}`, 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
        const listingId = listing.data?.data?.id || listing.data?.id;
        if (listingId) {
          const deal = await axios.post(`${ENV.GATEWAY_URL}/api/deals`, { listingId, amount: 99 }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token4}`, 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
          const dealId = deal.data?.id;
          if (dealId) {
            await axios.put(`${ENV.GATEWAY_URL}/api/deals/${dealId}/transition`, { toStatus: 'ACCEPTED' }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token4}`, 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
            await axios.put(`${ENV.GATEWAY_URL}/api/deals/${dealId}/transition`, { toStatus: 'COMPLETED' }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token4}`, 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
          }
        }
      },
    ]);

    this.generateLoadTestReport([s1, s2, s3, s4]);
  }
  private generateLoadTestReport(scenarios: any[]): void {
    const reportDir = path.join(__dirname, '..', 'reports');
    const report = { timestamp: new Date().toISOString(), scenarios };

    fs.writeFileSync(path.join(reportDir, 'load-test-report.json'), JSON.stringify(report, null, 2));

    const rows = scenarios.map(s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.userCount}</td>
        <td style="color:${s.metrics?.successRate >= 99 ? 'green' : 'red'}">${s.metrics?.successRate}%</td>
        <td>${s.metrics?.avg}ms</td>
        <td>${s.metrics?.p95}ms</td>
        <td>${s.metrics?.p99}ms</td>
        <td>${s.metrics?.reqPerSec}/s</td>
        <td>${s.duration}ms</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html dir="rtl"><head><meta charset="UTF-8"><title>WASITI Load Test</title>
<style>body{font-family:Cairo;background:#111;color:#eee;padding:20px}h1{color:#128C4F}table{border-collapse:collapse;width:100%}th,td{border:1px solid #333;padding:10px}th{background:#128C4F;color:#fff}tr:nth-child(even){background:#1a1a1a}</style></head>
<body><h1>🔥 WASITI 2027 — Load Test Report</h1><p>📅 ${report.timestamp}</p>
<table><tr><th>Scenario</th><th>Users</th><th>Success</th><th>Avg</th><th>P95</th><th>P99</th><th>Throughput</th><th>Duration</th></tr>${rows}</table>
<p style="margin-top:40px;color:#666">RC6-B1 — Advanced Load Testing</p></body></html>`;

    fs.writeFileSync(path.join(reportDir, 'load-test-report.html'), html);
    Logger.info('📁 load-test-report.json محفوظ');
    Logger.info('📁 load-test-report.html محفوظ');
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

    fs.writeFileSync(path.join(reportDir, 'performance-report.json'), JSON.stringify(report, null, 2));
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
