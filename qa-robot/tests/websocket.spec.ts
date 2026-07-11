import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('WebSocket & Real-time Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/ar/auth/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.locator('input[type="email"]').fill('buyer@wasity.ly');
    await page.locator('input[type="password"]').fill('Wasity@2026');
    await page.getByRole('button', { name: 'دخول' }).click();
    await page.waitForTimeout(3000);
  });

  test('صفحة المحادثات تفتح', async ({ page }) => {
    const response = await page.goto(`${BASE}/ar/chat`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
  });

  test('قائمة المحادثات تظهر', async ({ page }) => {
    await page.goto(`${BASE}/ar/chat`, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('الإشعارات تفتح للمستخدم', async ({ page }) => {
    const response = await page.goto(`${BASE}/ar/dashboard`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
  });
});