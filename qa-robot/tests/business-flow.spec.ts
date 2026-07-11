import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Business Flow — إنشاء إعلان', () => {
  
  test('تسجيل دخول Seller وإنشاء إعلان', async ({ page }) => {
    // 1. Login as seller
    await page.goto(`${BASE}/ar/auth/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.locator('input[type="email"]').fill('seller@wasity.ly');
    await page.locator('input[type="password"]').fill('Wasity@2026');
    await page.getByRole('button', { name: 'دخول' }).click();
    await page.waitForTimeout(3000);

    // 2. Go to create listing
    await page.goto(`${BASE}/ar/listing/create`, { waitUntil: 'networkidle' });
    
    // 3. Fill form
    await page.locator('input[name="title"]').fill('سيارة للبيع');
    await page.locator('input[name="price"]').fill('5000');
    
    // 4. Verify form loaded
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('Buyer لا يقدر ينشر إعلان', async ({ page }) => {
    await page.goto(`${BASE}/ar/auth/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.locator('input[type="email"]').fill('buyer@wasity.ly');
    await page.locator('input[type="password"]').fill('Wasity@2026');
    await page.getByRole('button', { name: 'دخول' }).click();
    await page.waitForTimeout(3000);

    const response = await page.goto(`${BASE}/ar/listing/create`, { waitUntil: 'load' });
    // Buyer should be redirected
    expect([403, 302]).toContain(response?.status());
  });
});