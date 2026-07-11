# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac.spec.ts >> RBAC Matrix >> مشرف محتوى - Moderator >> /ar/admin/users → 403
- Location: tests\rbac.spec.ts:24:13

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 403
Received: 200
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e7]:
    - generic [ref=e8]:
      - img [ref=e10]
      - heading "تسجيل الدخول" [level=1] [ref=e13]
      - paragraph [ref=e14]: أهلاً بك مجدداً
    - generic [ref=e15]:
      - generic [ref=e16]:
        - text: البريد الإلكتروني
        - textbox "أدخل بريدك الإلكتروني" [ref=e17]
      - generic [ref=e18]:
        - text: كلمة المرور
        - textbox "أدخل كلمة مرورك" [ref=e19]
      - link "نسيت كلمة المرور؟" [ref=e21] [cursor=pointer]:
        - /url: /ar/auth/forgot-password
      - button "دخول" [ref=e22] [cursor=pointer]
      - generic [ref=e23]:
        - text: ليس لديك حساب؟
        - link "سجل الآن" [ref=e24] [cursor=pointer]:
          - /url: /ar/auth/register
  - alert [ref=e25]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { IDENTITIES } from '../config/identities';
  3  | import { RBAC_MATRIX } from '../config/permissions';
  4  | 
  5  | const BASE = 'http://localhost:3000';
  6  | 
  7  | test.describe('RBAC Matrix', () => {
  8  |   
  9  |   for (const identity of IDENTITIES) {
  10 |     test.describe(`${identity.name}`, () => {
  11 |       
  12 |       test.beforeEach(async ({ page }) => {
  13 |         await page.goto(`${BASE}/ar/auth/login`, { waitUntil: 'networkidle' });
  14 |         await page.waitForTimeout(2000);
  15 |         await page.locator('input[type="email"]').fill(identity.email);
  16 |         await page.locator('input[type="password"]').fill(identity.password);
  17 |         await page.getByRole('button', { name: 'دخول' }).click();
  18 |         await page.waitForTimeout(3000);
  19 |       });
  20 | 
  21 |       const pagesToTest = RBAC_MATRIX.filter(r => r.role === identity.role);
  22 |       
  23 |       for (const rule of pagesToTest) {
  24 |         test(`${rule.page} → ${rule.expectedStatus}`, async ({ page }) => {
  25 |           const response = await page.goto(`${BASE}${rule.page}`, { waitUntil: 'load' });
> 26 |           expect(response?.status()).toBe(rule.expectedStatus);
     |                                      ^ Error: expect(received).toBe(expected) // Object.is equality
  27 |         });
  28 |       }
  29 |     });
  30 |   }
  31 | });
```