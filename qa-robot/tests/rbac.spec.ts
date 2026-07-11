import { test, expect } from '@playwright/test';
import { IDENTITIES } from '../config/identities';
import { RBAC_MATRIX } from '../config/permissions';

const BASE = 'http://localhost:3000';

test.describe('RBAC Matrix', () => {
  
  for (const identity of IDENTITIES) {
    test.describe(`${identity.name}`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE}/ar/auth/login`, { waitUntil: 'load' });
        await page.waitForTimeout(2000);
        await page.locator('input[type="email"]').fill(identity.email);
        await page.locator('input[type="password"]').fill(identity.password);
        await page.getByRole('button', { name: 'دخول' }).click();
        await page.waitForTimeout(3000);
      });

      const pagesToTest = RBAC_MATRIX.filter(r => r.role === identity.role);
      
      for (const rule of pagesToTest) {
        test(`${rule.page} → ${rule.expectedStatus}`, async ({ page }) => {
          const response = await page.goto(`${BASE}${rule.page}`, { waitUntil: 'load' });
          expect(response?.status()).toBe(rule.expectedStatus);
        });
      }
    });
  }
});