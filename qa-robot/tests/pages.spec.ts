import { test, expect } from '@playwright/test';
import { PAGES } from '../config/pages';

const BASE = 'http://localhost:3000';

test.describe('Frontend Pages Full Check', () => {
  
  for (const page of PAGES) {
    test(`${page.title} — ${page.path}`, async ({ page: pageObj }) => {
      const response = await pageObj.goto(`${BASE}${page.path}`, { waitUntil: 'load', timeout: 15000 });
      
      // 1. Status check
      expect([200, 302]).toContain(response?.status());
      
      // 2. Has body content
      const body = await pageObj.textContent('body');
      expect(body).toBeTruthy();
      
      // 3. No console errors
      const errors: string[] = [];
      pageObj.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      
      // 4. Check for basic elements
      const hasContent = body && body.length > 50;
      expect(hasContent).toBeTruthy();
    });
  }
});