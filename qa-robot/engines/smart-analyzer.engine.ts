import { Reporter, TestResult } from '../core/reporter';
import { Logger } from '../core/logger';

interface Analysis {
  pattern: string;
  probableCause: string;
  filesToCheck: string[];
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
}

const ANALYZER_RULES: Analysis[] = [
  {
    pattern: 'Auth Login',
    probableCause: 'bcrypt غير متوافق مع Docker Alpine. استبدل بـ bcryptjs.',
    filesToCheck: ['auth-service/package.json', 'auth-service/src/auth.service.ts'],
    severity: 'CRITICAL',
  },
  {
    pattern: 'Auth Register',
    probableCause: 'نفس مشكلة Auth Login - bcrypt.',
    filesToCheck: ['auth-service/package.json'],
    severity: 'CRITICAL',
  },
  {
    pattern: 'Listings List',
    probableCause: 'tenant-id header مفقود أو nginx لا يمرره.',
    filesToCheck: ['nginx.conf', 'listings-service/src/listing.controller.ts'],
    severity: 'CRITICAL',
  },
  {
    pattern: 'RBAC',
    probableCause: 'middleware.ts لا يتحقق من الصلاحيات أو role غير محدث في auth.store.',
    filesToCheck: ['middleware.ts', 'stores/auth.store.ts'],
    severity: 'CRITICAL',
  },
  {
    pattern: 'Wallet',
    probableCause: 'المحفظة غير منشأة للمستخدم أو tenant-id غير مطابق.',
    filesToCheck: ['wallet-service/src/wallet.service.ts'],
    severity: 'MAJOR',
  },
  {
    pattern: 'Notifications',
    probableCause: 'nginx route غير صحيح أو notification-service واقف.',
    filesToCheck: ['nginx.conf', 'notification-service/src/'],
    severity: 'MAJOR',
  },
  {
    pattern: 'Chat Conversations',
    probableCause: 'chat-service port غير مطابق في nginx (3004 vs 3008).',
    filesToCheck: ['nginx.conf', 'chat-service/src/'],
    severity: 'MAJOR',
  },
  {
    pattern: 'AI ',
    probableCause: 'ai-service غير مفعل أو nginx upstream غير موجود.',
    filesToCheck: ['nginx.conf', 'docker-compose.yml'],
    severity: 'MAJOR',
  },
  {
    pattern: 'Rate Limit',
    probableCause: 'nginx limit_req zone غير مضبوط أو بيرجع 503 بدل 429.',
    filesToCheck: ['nginx.conf'],
    severity: 'MAJOR',
  },
  {
    pattern: 'Gateway',
    probableCause: 'إحدى الخدمات واقفة تسبب restart متكرر لـ Gateway.',
    filesToCheck: ['docker-compose.yml', 'docker logs wasity-gateway'],
    severity: 'CRITICAL',
  },
];

export class SmartAnalyzer {
  private reporter: Reporter;

  constructor(reporter: Reporter) {
    this.reporter = reporter;
  }

  analyze(failures: TestResult[]): void {
    Logger.header('🧠 Smart Analyzer');

    if (failures.length === 0) {
      Logger.pass('لا توجد أخطاء للتحليل');
      return;
    }

    const analyzed: Set<string> = new Set();

    for (const failure of failures) {
      for (const rule of ANALYZER_RULES) {
        if (failure.test.includes(rule.pattern) && !analyzed.has(rule.pattern)) {
          analyzed.add(rule.pattern);
          
          this.reporter.addResult({
            test: `تحليل: ${rule.pattern}`,
            category: 'analyzer',
            passed: false,
            expected: 'يعمل بدون أخطاء',
            actual: rule.probableCause,
            severity: rule.severity,
          });

          Logger.warn(`🔍 ${rule.pattern}`);
          Logger.info(`   السبب المرجح: ${rule.probableCause}`);
          Logger.info(`   ملفات للفحص: ${rule.filesToCheck.join(', ')}`);
        }
      }
    }

    Logger.info(`🧠 تم تحليل ${analyzed.size} نمط خطأ`);
  }
}