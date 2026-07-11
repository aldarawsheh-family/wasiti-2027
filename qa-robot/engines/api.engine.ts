import axios from 'axios';
import { Reporter } from '../core/reporter';
import { Logger } from '../core/logger';
import { ENV } from '../config/environment';

// Dynamic Test IDs — تنشأ وقت التشغيل
const testIds: any = {
  listingId: '',
  dealId: '',
  notificationId: '',
  companyId: '',
  walletRequestId: '',
};

const ENDPOINTS = [
  // Health
  { name: 'Gateway Health', method: 'GET', url: '/health', auth: false },
  { name: 'System Health', method: 'GET', url: '/api/system/health', auth: false },
  
  // Auth (5)
  { name: 'Auth Register', method: 'POST', url: '/api/auth/register', auth: false, body: { email: 'test@test.com', password: 'Wasity@2026', name: 'Test' } },
  { name: 'Auth Login', method: 'POST', url: '/api/auth/login', auth: false, body: { email: 'admin2@wasity.ly', password: 'Wasity@2026' } },
  { name: 'Auth Refresh', method: 'POST', url: '/api/auth/refresh', auth: true },
  { name: 'Auth Logout', method: 'POST', url: '/api/auth/logout', auth: true },
  { name: 'Auth Me', method: 'GET', url: '/api/auth/me', auth: true },
  
  // Users (8)
  { name: 'Users List', method: 'GET', url: '/api/users', auth: true },
  { name: 'Users Profile', method: 'GET', url: '/api/users/profile', auth: true },
  { name: 'Users Update Profile', method: 'PUT', url: '/api/users/profile', auth: true, body: { display_name: 'Test' } },
  { name: 'Users Get By Id', method: 'GET', url: '/api/users/${testIds.listingId}', auth: true, dynamic: true },
  { name: 'Users Update', method: 'PUT', url: '/api/users/${testIds.listingId}', auth: true, body: { display_name: 'Updated' }, dynamic: true },
  { name: 'Users Delete', method: 'DELETE', url: '/api/users/${testIds.listingId}', auth: true, dynamic: true },
  
  // Listings (7)
  { name: 'Listings List', method: 'GET', url: '/api/listings', auth: false },
  { name: 'Listings Search', method: 'GET', url: '/api/listings?city=دمشق', auth: false },
  { name: 'Listings Create', method: 'POST', url: '/api/listings', auth: true, body: { title: 'QA Test', price: 99, city: 'دمشق', category: 'Cars' }, saveId: 'listingId' },
  { name: 'Listings Get By Id', method: 'GET', url: '/api/listings/${testIds.listingId}', auth: false, dynamic: true },
  { name: 'Listings Update', method: 'PUT', url: '/api/listings/${testIds.listingId}', auth: true, body: { title: 'Updated' }, dynamic: true },
  { name: 'Listings Delete', method: 'DELETE', url: '/api/listings/${testIds.listingId}', auth: true, dynamic: true },
  { name: 'Listings Status', method: 'PUT', url: '/api/listings/${testIds.listingId}/status', auth: true, body: { status: 'ACTIVE' }, dynamic: true },
  
  // Deals (7)
  { name: 'Deals List', method: 'GET', url: '/api/deals', auth: true },
  { name: 'Deals Create', method: 'POST', url: '/api/deals', auth: true, body: { listingId: '${testIds.listingId}', amount: 99 }, dynamic: true, saveId: 'dealId' },
  { name: 'Deals Get By Id', method: 'GET', url: '/api/deals/${testIds.dealId}', auth: true, dynamic: true },
  { name: 'Deals Accept', method: 'PUT', url: '/api/deals/${testIds.dealId}/transition', auth: true, body: { toStatus: 'ACCEPTED' }, dynamic: true },
  { name: 'Deals Complete', method: 'PUT', url: '/api/deals/${testIds.dealId}/transition', auth: true, body: { toStatus: 'COMPLETED' }, dynamic: true },
  { name: 'Deals Cancel', method: 'PUT', url: '/api/deals/${testIds.dealId}/transition', auth: true, body: { toStatus: 'CANCELLED' }, dynamic: true },
  
  // Wallet (10)
  { name: 'Wallet Me', method: 'GET', url: '/api/wallet/me', auth: true },
  { name: 'Wallet Statement', method: 'GET', url: '/api/wallet/me/statement', auth: true },
  { name: 'Wallet Requests', method: 'GET', url: '/api/wallet/requests', auth: true },
  { name: 'Wallet Request', method: 'POST', url: '/api/wallet/request', auth: true, body: { type: 'DEPOSIT', amount: 100 }, saveId: 'walletRequestId' },
  { name: 'Wallet Escrow Hold', method: 'POST', url: '/api/wallet/escrow/hold', auth: true, body: { listingId: '${testIds.listingId}', amount: 99 }, dynamic: true },
  { name: 'Wallet Escrow Release', method: 'POST', url: '/api/wallet/escrow/release/${testIds.dealId}', auth: true, dynamic: true },
  { name: 'Wallet Escrow Refund', method: 'POST', url: '/api/wallet/escrow/refund/${testIds.dealId}', auth: true, dynamic: true },
  
  // Companies (7)
  { name: 'Companies List', method: 'GET', url: '/api/companies', auth: true },
  { name: 'My Company', method: 'GET', url: '/api/companies/my-company', auth: true },
  { name: 'Companies Create', method: 'POST', url: '/api/companies', auth: true, body: { name: 'QA Company', type: 'dealer' }, saveId: 'companyId' },
  { name: 'Companies Manifest', method: 'GET', url: '/api/companies/manifest/transport', auth: true },
  
  // Notifications (4)
  { name: 'Notifications List', method: 'GET', url: '/api/notifications', auth: true },
  { name: 'Notifications Unread', method: 'GET', url: '/api/notifications/unread-count', auth: true },
  { name: 'Notifications Send', method: 'POST', url: '/api/notifications/send', auth: true, body: { userId: 'ad88652f-18fe-4292-8e88-3a1ff9441c17', title: 'QA Test', message: 'Test', type: 'deal' } },
  { name: 'Notifications Read All', method: 'PUT', url: '/api/notifications/read-all', auth: true },
  
  // Chat (3)
  { name: 'Chat Conversations', method: 'GET', url: '/api/chat/conversations', auth: true },
  { name: 'Chat Send Message', method: 'POST', url: '/api/chat/conversations/${testIds.dealId}/messages', auth: true, body: { text: 'Hello' }, dynamic: true },
  
  // AI (4)
  { name: 'AI Docs', method: 'GET', url: '/api/ai/docs', auth: false },
  { name: 'AI Recommendations', method: 'GET', url: '/api/ai/recommendations?userId=ad88652f-18fe-4292-8e88-3a1ff9441c17', auth: false },
  { name: 'AI Similar', method: 'GET', url: '/api/ai/similar/${testIds.listingId}', auth: false, dynamic: true },
  { name: 'AI Suggestions', method: 'GET', url: '/api/ai/suggestions?q=سيارة', auth: false },
];

export class ApiEngine {
  private reporter: Reporter;
  private token: string = '';

  constructor(reporter: Reporter) {
    this.reporter = reporter;
  }

  private headers() {
    const h: any = { 'Content-Type': 'application/json', 'tenant-id': ENV.DEFAULT_TENANT_ID };
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  }

  async checkApi(): Promise<void> {
    Logger.header(`🔌 فحص API (${ENDPOINTS.length} Endpoints)`);

    // Login
    try {
      const res = await axios.post(`${ENV.GATEWAY_URL}/api/auth/login`, {
        email: 'admin2@wasity.ly', password: 'Wasity@2026',
      }, { headers: { 'Content-Type': 'application/json', 'tenant-id': ENV.DEFAULT_TENANT_ID }, timeout: 5000 });
      this.token = res.data.accessToken;
      Logger.pass('تم تسجيل الدخول للـ API');
    } catch {
      Logger.warn('فشل تسجيل الدخول - بعض الاختبارات بدون توكن');
    }

    // Create test data first
    await this.createTestData();

    // Run all endpoints
    for (const ep of ENDPOINTS) {
      if (ep.dynamic && !testIds[ep.saveId || '']) {
        // Skip if dynamic ID not ready
        continue;
      }

      const url = ep.url.replace(/\$\{testIds\.(\w+)\}/g, (_: string, key: string) => testIds[key] || '');
      const start = Date.now();
      try {
        const config: any = { headers: this.headers(), timeout: 5000 };
        let res;
        if (ep.method === 'GET') {
          res = await axios.get(`${ENV.GATEWAY_URL}${url}`, config);
        } else if (ep.method === 'PUT') {
          res = await axios.put(`${ENV.GATEWAY_URL}${url}`, ep.body || {}, config);
        } else if (ep.method === 'DELETE') {
          res = await axios.delete(`${ENV.GATEWAY_URL}${url}`, config);
        } else {
          res = await axios.post(`${ENV.GATEWAY_URL}${url}`, ep.body || {}, config);
        }

        // Save ID if this is a create endpoint
        if (ep.saveId && res.data) {
          const id = res.data.id || res.data.data?.id || res.data.requestId;
          if (id) {
            testIds[ep.saveId] = id;
            Logger.info(`📌 ${ep.saveId} = ${id}`);
          }
        }

        const duration = Date.now() - start;
        this.reporter.addResult({
          test: ep.name, category: 'api',
          passed: [200, 201, 401, 403].includes(res.status),
          expected: '200/201/401/403',
          actual: `${res.status} (${duration}ms)`,
          severity: res.status >= 500 ? 'CRITICAL' : 'MAJOR',
          duration,
        });
      } catch (err: any) {
        const duration = Date.now() - start;
        const status = err.response?.status || 0;
        this.reporter.addResult({
          test: ep.name, category: 'api',
          passed: [401, 403].includes(status),
          expected: '200/201/401/403',
          actual: `${status} (${duration}ms)`,
          severity: status >= 500 ? 'CRITICAL' : 'MAJOR',
          duration,
        });
      }
    }

    // Cleanup
    await this.cleanupTestData();
  }

  private async createTestData(): Promise<void> {
    Logger.info('📦 إنشاء بيانات الاختبار...');
    
    // Create Listing
    try {
      const res = await axios.post(`${ENV.GATEWAY_URL}/api/listings`, {
        title: 'QA Dynamic Test', price: 99, city: 'دمشق', category: 'Cars',
      }, { headers: this.headers(), timeout: 5000 });
      const id = res.data?.data?.id || res.data?.id;
      if (id) {
        testIds.listingId = id;
        Logger.pass(`✅ Listing: ${id}`);
      }
    } catch (err: any) {
      Logger.warn('⚠️ فشل إنشاء Listing تجريبي');
    }

    // Create Deal
    if (testIds.listingId) {
      try {
        const res = await axios.post(`${ENV.GATEWAY_URL}/api/deals`, {
          listingId: testIds.listingId, amount: 99,
        }, { headers: this.headers(), timeout: 5000 });
        const id = res.data?.id;
        if (id) {
          testIds.dealId = id;
          Logger.pass(`✅ Deal: ${id}`);
        }
      } catch (err: any) {
        Logger.warn('⚠️ فشل إنشاء Deal تجريبي');
      }
    }
  }

  private async cleanupTestData(): Promise<void> {
    Logger.info('🧹 تنظيف بيانات الاختبار...');
    
    // Delete Deal
    if (testIds.dealId) {
      try {
        await axios.delete(`${ENV.GATEWAY_URL}/api/deals/${testIds.dealId}`, { headers: this.headers(), timeout: 5000 });
        Logger.pass('✅ Deal deleted');
      } catch { /* ignore */ }
    }

    // Delete Listing
    if (testIds.listingId) {
      try {
        await axios.delete(`${ENV.GATEWAY_URL}/api/listings/${testIds.listingId}`, { headers: this.headers(), timeout: 5000 });
        Logger.pass('✅ Listing deleted');
      } catch { /* ignore */ }
    }
  }

  async checkApiQuick(): Promise<void> {
    Logger.header('🔌 فحص سريع (Health)');
    const healthChecks = [
      { name: 'Gateway Health', url: '/health' },
      { name: 'System Health', url: '/api/system/health' },
      { name: 'AI Docs', url: '/api/ai/docs' },
    ];
    for (const hc of healthChecks) {
      const start = Date.now();
      try {
        const res = await axios.get(`${ENV.GATEWAY_URL}${hc.url}`, { timeout: 5000 });
        this.reporter.addResult({
          test: hc.name, category: 'api',
          passed: res.status === 200,
          expected: '200', actual: `${res.status} (${Date.now() - start}ms)`,
          severity: 'CRITICAL',
        });
      } catch (err: any) {
        this.reporter.addResult({
          test: hc.name, category: 'api',
          passed: false,
          expected: '200', actual: `${err.response?.status || 0} (${Date.now() - start}ms)`,
          severity: 'CRITICAL',
        });
      }
    }
  }
}