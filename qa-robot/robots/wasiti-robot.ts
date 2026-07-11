import { SmartAnalyzer } from '../engines/smart-analyzer.engine';
import { DiscoveryEngine } from '../engines/discovery.engine';
import { PerformanceEngine } from '../engines/performance.engine';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';
import { ENV } from '../config/environment';
import { DockerEngine } from '../engines/docker.engine';
import { DatabaseEngine } from '../engines/database.engine';
import { RedisEngine } from '../engines/redis.engine';
import { RabbitMQEngine } from '../engines/rabbitmq.engine';
import { ApiEngine } from '../engines/api.engine';

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'full';

  const reporter = new Reporter();
  reporter.start();

  Logger.header('WASITI 2027 QA Robot');
  Logger.info(`🟢 RC2 — ${new Date().toISOString()}`);
  Logger.info(`🌐 Gateway: ${ENV.GATEWAY_URL}`);
  Logger.info(`📋 Mode: ${mode}`);

  // ── Quick Check ──
  if (mode === '--quick') {
    const docker = new DockerEngine(reporter);
    await docker.checkContainers();

    const api = new ApiEngine(reporter);
    await api.checkApiQuick();
  }

  // ── Performance Mode ──
  else if (mode === '--performance') {
    const perf = new PerformanceEngine(reporter);
    await perf.runPerformance();
  }

  // ── Full Check ──
  else {
    const discovery = new DiscoveryEngine(reporter);
    await discovery.discover();

    const docker = new DockerEngine(reporter);
    await docker.checkContainers();

    const database = new DatabaseEngine(reporter);
    await database.checkDatabase();

    const redis = new RedisEngine(reporter);
    await redis.checkRedis();

    const rabbitmq = new RabbitMQEngine(reporter);
    await rabbitmq.checkRabbitMQ();

    const api = new ApiEngine(reporter);
    await api.checkApi();
  }
  const analyzer = new SmartAnalyzer(reporter);
  const failures = reporter.getFailures();
  analyzer.analyze(failures);
  const report = reporter.generateReport();
  process.exit(report.summary.critical > 0 ? 1 : 0);
}

main().catch((err) => {
  Logger.error('فشل تشغيل الروبوت', err);
  process.exit(1);
});