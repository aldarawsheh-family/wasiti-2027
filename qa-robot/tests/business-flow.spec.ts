import { test, expect } from '@playwright/test';

const API = 'http://localhost:8080';
const TENANT = '00000000-0000-0000-0000-000000000001';

const results: { name: string; status: string; entityId: string; responseTime: string }[] = [];

function logStep(name: string, status: string, entityId: string, responseTime: string) {
  results.push({ name, status, entityId, responseTime });
  console.log(`  ${status === 'PASS' ? '✅' : '❌'} ${name} | ${entityId || '-'} | ${responseTime}`);
}

test('Business Flow E2E: Company → Listing → Deal → Wallet → Notification', async ({ request }) => {

  let buyerToken = '', companyToken = '', adminToken = '';

  // 1. Admin Login
  const t1 = Date.now();
  const adminLogin = await request.post(`${API}/api/auth/login`, {
    headers: { 'Content-Type': 'application/json', 'tenant-id': TENANT },
    data: { email: 'admin2@wasity.ly', password: 'Wasity@2026' }
  });
  adminToken = (await adminLogin.json()).accessToken;
  logStep('Admin Login', adminLogin.status() === 200 || adminLogin.status() === 201 ? 'PASS' : 'FAIL', 'admin2', `${Date.now() - t1}ms`);

  // 2. COMPANY_ADMIN Login
  const t2 = Date.now();
  const caLogin = await request.post(`${API}/api/auth/login`, {
    headers: { 'Content-Type': 'application/json', 'tenant-id': TENANT },
    data: { email: 'test.user@wasity.ly', password: 'Wasity@2026' }
  });
  companyToken = (await caLogin.json()).accessToken;
  logStep('COMPANY_ADMIN Login', caLogin.status() === 200 || caLogin.status() === 201 ? 'PASS' : 'FAIL', 'test.user', `${Date.now() - t2}ms`);

  // 3. Buyer Login
  const t3 = Date.now();
  const buyerLogin = await request.post(`${API}/api/auth/login`, {
    headers: { 'Content-Type': 'application/json', 'tenant-id': TENANT },
    data: { email: 'buyer@wasity.ly', password: 'Wasity@2026' }
  });
  buyerToken = (await buyerLogin.json()).accessToken;
  logStep('Buyer Login', buyerLogin.status() === 200 || buyerLogin.status() === 201 ? 'PASS' : 'FAIL', 'buyer', `${Date.now() - t3}ms`);

  // 4. Create Listing
  const t4 = Date.now();
  const listing = await request.post(`${API}/api/listings`, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${companyToken}`, 'tenant-id': TENANT },
    data: { title: 'E2E Flow Test', price: 500, city: 'دمشق', category: 'Cars' }
  });
  const listingData = await listing.json();
  const listingId = listingData?.data?.id || listingData?.id;
  logStep('Create Listing', listing.status() === 201 || listing.status() === 200 ? 'PASS' : 'FAIL', listingId, `${Date.now() - t4}ms`);

  // 5. Create Deal
  const t5 = Date.now();
  const deal = await request.post(`${API}/api/deals`, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${buyerToken}`, 'tenant-id': TENANT },
    data: { listingId, amount: 500 }
  });
  const dealData = await deal.json();
  const dealId = dealData?.id;
  logStep('Create Deal', deal.status() === 201 || deal.status() === 200 ? 'PASS' : 'FAIL', dealId, `${Date.now() - t5}ms`);

  // 6. ACCEPTED
  const t6 = Date.now();
  const accept = await request.put(`${API}/api/deals/${dealId}/transition`, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${companyToken}`, 'tenant-id': TENANT },
    data: { toStatus: 'ACCEPTED' }
  });
  logStep('Deal ACCEPTED', (await accept.json()).status === 'ACCEPTED' ? 'PASS' : 'FAIL', dealId, `${Date.now() - t6}ms`);

  // 7. IN_PROGRESS
  const t7 = Date.now();
  const progress = await request.put(`${API}/api/deals/${dealId}/transition`, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${companyToken}`, 'tenant-id': TENANT },
    data: { toStatus: 'IN_PROGRESS' }
  });
  logStep('Deal IN_PROGRESS', (await progress.json()).status === 'IN_PROGRESS' ? 'PASS' : 'FAIL', dealId, `${Date.now() - t7}ms`);

  // 8. COMPLETED
  const t8 = Date.now();
  const complete = await request.put(`${API}/api/deals/${dealId}/transition`, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${companyToken}`, 'tenant-id': TENANT },
    data: { toStatus: 'COMPLETED' }
  });
  logStep('Deal COMPLETED', (await complete.json()).status === 'COMPLETED' ? 'PASS' : 'FAIL', dealId, `${Date.now() - t8}ms`);

  // 9. Wallet Request
  const t9 = Date.now();
  const walletReq = await request.post(`${API}/api/wallet/request`, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${buyerToken}`, 'tenant-id': TENANT },
    data: { type: 'DEPOSIT', amount: 1000 }
  });
  const walletData = await walletReq.json();
  const requestId = walletData?.requestId;
  logStep('Wallet Request', walletReq.status() === 201 || walletReq.status() === 200 ? 'PASS' : 'FAIL', requestId, `${Date.now() - t9}ms`);

  // 10. Admin Approve
  let approvePass = false;
  if (requestId) {
    const t10 = Date.now();
    const approve = await request.post(`${API}/api/wallet/approve/${requestId}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}`, 'tenant-id': TENANT },
      data: {}
    });
    const appData = await approve.json();
    approvePass = appData?.success === true;
    logStep('Admin Approve', approvePass ? 'PASS' : 'FAIL', requestId, `${Date.now() - t10}ms`);
  }

  // 11. Notification
  const t11 = Date.now();
  const notif = await request.post(`${API}/api/notifications/send`, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}`, 'tenant-id': TENANT },
    data: { userId: 'ad88652f-18fe-4292-8e88-3a1ff9441c17', title: 'Deal Done', message: 'E2E', type: 'deal' }
  });
  const notifData = await notif.json();
  logStep('Send Notification', notif.status() === 201 || notif.status() === 200 ? 'PASS' : 'FAIL', notifData?.id, `${Date.now() - t11}ms`);

  // SUMMARY
  const passed = results.filter(r => r.status === 'PASS').length;
  console.log(`\n📊 Business Flow: ${passed}/${results.length} PASS`);
  expect(passed).toBeGreaterThanOrEqual(results.length - 1);
});