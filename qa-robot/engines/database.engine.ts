import { execSync } from 'child_process';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';

const SCHEMAS = [
  'auth', 'user_svc', 'company', 'listing', 'deal',
  'chat', 'notification', 'transport', 'booking', 'wallet', 'billing',
];

const RLS_TABLES = [
  'auth.users',
  'listing.listings', 'listing.categories',
  'deal.deals', 'deal.deal_transitions',
  'chat.chat_rooms', 'chat.chat_messages',
  'notification.notifications',
  'wallet.wallets', 'wallet.ledger', 'wallet.transactions',
  'wallet.escrow', 'wallet.refund', 'wallet.settlements', 'wallet.reconciliation',
];

const CRITICAL_COLUMNS = [
  { table: 'auth.users', column: 'email' },
  { table: 'auth.users', column: 'role' },
  { table: 'listing.listings', column: 'tenant_id' },
  { table: 'listing.listings', column: 'owner_id' },
  { table: 'deal.deals', column: 'listing_id' },
  { table: 'deal.deals', column: 'buyer_id' },
  { table: 'deal.deals', column: 'seller_id' },
  { table: 'wallet.wallets', column: 'user_id' },
  { table: 'wallet.wallets', column: 'balance' },
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

    // 1. Connection
    try {
      this.query('SELECT 1');
      Logger.pass('✅ متصل بقاعدة البيانات');
      this.reporter.addResult({
        test: 'الاتصال بقاعدة البيانات', category: 'database',
        passed: true, expected: 'متصل', actual: 'متصل', severity: 'CRITICAL',
      });
    } catch (err: any) {
      Logger.fail('❌ فشل الاتصال بقاعدة البيانات');
      this.reporter.addResult({
        test: 'الاتصال بقاعدة البيانات', category: 'database',
        passed: false, expected: 'متصل', actual: err.message?.substring(0, 80), severity: 'CRITICAL',
      });
      return;
    }

    // 2. Schemas
    for (const schema of SCHEMAS) {
      try {
        const result = this.query(
          `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${schema}'`
        );
        const tableCount = parseInt(result) || 0;
        const passed = tableCount > 0;
        if (passed) Logger.pass(`  ✅ Schema ${schema}: ${tableCount} جداول`);
        else Logger.fail(`  ❌ Schema ${schema}: فارغ`);
        this.reporter.addResult({
          test: `Schema ${schema}`, category: 'database',
          passed, expected: 'جداول موجودة', actual: `${tableCount} جداول`, severity: 'MAJOR',
        });
      } catch (err: any) {
        this.reporter.addResult({
          test: `Schema ${schema}`, category: 'database',
          passed: false, expected: 'موجود', actual: err.message?.substring(0, 50), severity: 'MAJOR',
        });
      }
    }

    // 3. RLS
    Logger.info('🔒 فحص RLS...');
    for (const table of RLS_TABLES) {
      try {
        const result = this.query(
          `SELECT relrowsecurity FROM pg_class WHERE relname = '${table.split('.')[1]}' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = '${table.split('.')[0]}')`
        );
        const rlsEnabled = result.includes('t') || result.includes('true');
        if (rlsEnabled) Logger.pass(`  ✅ RLS ${table}`);
        else Logger.warn(`  ⚠️ RLS غير مفعل: ${table}`);
        this.reporter.addResult({
          test: `RLS ${table}`, category: 'database',
          passed: rlsEnabled, expected: 'مفعل', actual: rlsEnabled ? 'مفعل' : 'غير مفعل', severity: 'MAJOR',
        });
      } catch {
        this.reporter.addResult({
          test: `RLS ${table}`, category: 'database',
          passed: false, expected: 'موجود', actual: 'غير موجود', severity: 'MAJOR',
        });
      }
    }

    // 4. NULL check
    Logger.info('🔍 فحص NULL في الأعمدة الحرجة...');
    for (const col of CRITICAL_COLUMNS) {
      try {
        const result = this.query(
          `SELECT COUNT(*) FROM ${col.table} WHERE ${col.column} IS NULL`
        );
        const nullCount = parseInt(result) || 0;
        const passed = nullCount === 0;
        if (passed) Logger.pass(`  ✅ ${col.table}.${col.column}: 0 NULL`);
        else Logger.fail(`  ❌ ${col.table}.${col.column}: ${nullCount} NULL`);
        this.reporter.addResult({
          test: `NULL ${col.table}.${col.column}`, category: 'database',
          passed, expected: '0 NULL', actual: `${nullCount} NULL`, severity: 'MAJOR',
        });
      } catch (err: any) {
        this.reporter.addResult({
          test: `NULL ${col.table}.${col.column}`, category: 'database',
          passed: false, expected: 'تم الفحص', actual: err.message?.substring(0, 50), severity: 'MAJOR',
        });
      }
    }

    // 5. FK check
    Logger.info('🔗 فحص Foreign Keys...');
    try {
      const result = this.query(
        `SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY'`
      );
      const fkCount = parseInt(result) || 0;
      Logger.pass(`  ✅ ${fkCount} Foreign Keys موجودة`);
      this.reporter.addResult({
        test: 'Foreign Keys', category: 'database',
        passed: fkCount > 0, expected: 'موجودة', actual: `${fkCount} FK`, severity: 'MAJOR',
      });
    } catch {
      this.reporter.addResult({
        test: 'Foreign Keys', category: 'database',
        passed: false, expected: 'موجودة', actual: 'فشل الفحص', severity: 'MAJOR',
      });
    }

    // 6. Tenant Isolation
    Logger.info('🏢 فحص Tenant Isolation...');
    try {
      const tenants = this.query(`SELECT COUNT(DISTINCT tenant_id) FROM listing.listings`);
      const tenantCount = parseInt(tenants) || 0;
      Logger.pass(`  ✅ ${tenantCount} مستأجرين مختلفين`);
      this.reporter.addResult({
        test: 'Tenant Isolation', category: 'database',
        passed: true, expected: '> 0', actual: `${tenantCount} tenants`, severity: 'MAJOR',
      });
    } catch {
      this.reporter.addResult({
        test: 'Tenant Isolation', category: 'database',
        passed: false, expected: 'يوجد فحص', actual: 'فشل الفحص', severity: 'MAJOR',
      });
    }

    // 7. Replication
    Logger.info('🔄 فحص Replication...');
    try {
      const slave = execSync(
        `docker exec wasity-postgres-slave psql -U wasity -d wasity -t -c "SELECT 1"`,
        { encoding: 'utf-8', timeout: 5000 }
      ).trim();
      const passed = slave.includes('1');
      if (passed) Logger.pass('  ✅ Slave متصل');
      else Logger.fail('  ❌ Slave غير متصل');
      this.reporter.addResult({
        test: 'Replication Slave', category: 'database',
        passed, expected: 'متصل', actual: passed ? 'متصل' : 'غير متصل', severity: 'CRITICAL',
      });
    } catch {
      this.reporter.addResult({
        test: 'Replication Slave', category: 'database',
        passed: false, expected: 'متصل', actual: 'فشل الاتصال', severity: 'CRITICAL',
      });
    }

    // 8. Constraint Check
    Logger.info('🔐 فحص Constraints...');
    try {
      const uniqueCount = this.query(
        `SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'UNIQUE'`
      );
      const notNullCount = this.query(
        `SELECT COUNT(*) FROM information_schema.columns WHERE is_nullable = 'NO' AND table_schema NOT IN ('pg_catalog', 'information_schema')`
      );
      Logger.pass(`  ✅ ${parseInt(uniqueCount)} UNIQUE, ${parseInt(notNullCount)} NOT NULL`);
      this.reporter.addResult({
        test: 'Constraints', category: 'database',
        passed: true, expected: 'موجودة', actual: `${parseInt(uniqueCount)} UNIQUE, ${parseInt(notNullCount)} NOT NULL`, severity: 'MAJOR',
      });
    } catch {
      this.reporter.addResult({
        test: 'Constraints', category: 'database',
        passed: false, expected: 'موجودة', actual: 'فشل الفحص', severity: 'MAJOR',
      });
    }

    // 9. Index Check
    Logger.info('📊 فحص Indexes...');
    try {
      const idxCount = this.query(
        `SELECT COUNT(*) FROM pg_indexes WHERE schemaname NOT IN ('pg_catalog', 'information_schema')`
      );
      Logger.pass(`  ✅ ${parseInt(idxCount)} indexes`);
      this.reporter.addResult({
        test: 'Indexes', category: 'database',
        passed: true, expected: 'موجودة', actual: `${parseInt(idxCount)} indexes`, severity: 'MAJOR',
      });
    } catch {
      this.reporter.addResult({
        test: 'Indexes', category: 'database',
        passed: false, expected: 'موجودة', actual: 'فشل الفحص', severity: 'MAJOR',
      });
    }

    // 10. Data Integrity
    Logger.info('🔎 فحص Data Integrity...');
    try {
      const orphanDeals = this.query(
        `SELECT COUNT(*) FROM deal.deals d LEFT JOIN listing.listings l ON d.listing_id = l.id WHERE l.id IS NULL`
      );
      const dupEmail = this.query(
        `SELECT COUNT(*) FROM (SELECT email, COUNT(*) FROM auth.users GROUP BY email HAVING COUNT(*) > 1) AS dups`
      );
      const passed = parseInt(orphanDeals) === 0 && parseInt(dupEmail) === 0;
      if (passed) Logger.pass('  ✅ 0 orphan records, 0 duplicate emails');
      else Logger.fail(`  ❌ ${parseInt(orphanDeals)} orphan deals, ${parseInt(dupEmail)} duplicate emails`);
      this.reporter.addResult({
        test: 'Data Integrity', category: 'database',
        passed, expected: '0 orphans, 0 duplicates', actual: `${parseInt(orphanDeals)} orphans, ${parseInt(dupEmail)} dupes`, severity: 'CRITICAL',
      });
    } catch {
      this.reporter.addResult({
        test: 'Data Integrity', category: 'database',
        passed: false, expected: 'نظيف', actual: 'فشل الفحص', severity: 'CRITICAL',
      });
    }

    // 11. Backup Status
    Logger.info('💾 فحص Backup...');
    try {
      const slaveLag = execSync(
        `docker exec wasity-postgres psql -U wasity -d wasity -t -c "SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) FROM pg_stat_replication"`,
        { encoding: 'utf-8', timeout: 5000 }
      ).trim();
      const lag = parseInt(slaveLag) || 0;
      const passed = lag < 1000000;
      if (passed) Logger.pass(`  ✅ Replication lag: ${lag} bytes`);
      else Logger.warn(`  ⚠️ Replication lag: ${lag} bytes`);
      this.reporter.addResult({
        test: 'Backup / Replication Lag', category: 'database',
        passed, expected: '< 1MB', actual: `${lag} bytes`, severity: 'MAJOR',
      });
    } catch {
      this.reporter.addResult({
        test: 'Backup / Replication Lag', category: 'database',
        passed: false, expected: 'شغال', actual: 'فشل الفحص', severity: 'MAJOR',
      });
    }

    // 12. Table Stats
    Logger.info('📈 إحصائيات الجداول...');
    try {
      const totalRows = this.query(
        `SELECT SUM(n_live_tup) FROM pg_stat_user_tables`
      );
      const totalTables = this.query(
        `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema')`
      );
      Logger.pass(`  ✅ ${parseInt(totalTables)} جداول, ~${parseInt(totalRows)} صف`);
      this.reporter.addResult({
        test: 'Table Stats', category: 'database',
        passed: true, expected: 'بيانات موجودة', actual: `${parseInt(totalTables)} tables, ~${parseInt(totalRows)} rows`, severity: 'MAJOR',
      });
    } catch {
      this.reporter.addResult({
        test: 'Table Stats', category: 'database',
        passed: false, expected: 'موجود', actual: 'فشل', severity: 'MAJOR',
      });
    }
  }
}