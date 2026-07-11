import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const API = 'http://localhost:8080';

test.describe('Security Tests', () => {

  // 1. JWT Tests
  test('طلب API بدون JWT → 401', async ({ request }) => {
    const res = await request.get(`${API}/api/wallet/me`);
    expect(res.status()).toBe(401);
  });

  test('JWT expired → 401', async ({ request }) => {
    const res = await request.get(`${API}/api/wallet/me`, {
      headers: { Authorization: 'Bearer expired_token_12345' }
    });
    expect([401, 403]).toContain(res.status());
  });

  // 2. RBAC Tests
  test('مستخدم عادي → Admin → 403', async ({ page }) => {
    await page.goto(`${BASE}/ar/auth/login`, {waitUntil: 'load'  });
    await page.waitForTimeout(1000);
    await page.locator('input[type="email"]').fill('buyer@wasity.ly');
    await page.locator('input[type="password"]').fill('Wasity@2026');
    await page.getByRole('button', { name: 'دخول' }).click();
    await page.waitForTimeout(3000);
    
    const response = await page.goto(`${BASE}/ar/admin`, { waitUntil: 'networkidle' });
    expect([403, 302]).toContain(response?.status());
  });

  // 3. XSS
  test('XSS payload في البحث', async ({ page }) => {
    const res = await page.goto(`${BASE}/ar/search?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E`);
    expect(res?.status()).toBe(200);
    const body = await page.textContent('body');
    expect(body).not.toContain('<script>alert(1)</script>');
  });

  // 4. SQL Injection
  test('SQL Injection → مرفوض', async ({ request }) => {
    const res = await request.get(`${API}/api/listings?city='; DROP TABLE listings;--`);
    expect([400, 403, 500]).toContain(res.status());
  });

  // 5. Rate Limit
  test('Rate Limit - 6 محاولات → 429', async ({ request }) => {
    for (let i = 0; i < 6; i++) {
      const res = await request.post(`${API}/api/auth/login`, {
        data: { email: 'wrong@test.com', password: 'wrong' }
      });
      if (i === 5) expect([429, 503]).toContain(res.status());
    }
  });

  // 6. Tenant Isolation
  test('tenant-id مختلف → 403', async ({ request }) => {
    const res = await request.get(`${API}/api/wallet/me`, {
      headers: { 'tenant-id': '11111111-1111-1111-1111-111111111111' }
    });
    expect([401, 403]).toContain(res.status());
  });

  // 7. CORS
  test('CORS headers موجودة', async ({ request }) => {
    const res = await request.get(`${API}/health`);
    expect(res.headers()['access-control-allow-origin']).toBeTruthy();
  });
});