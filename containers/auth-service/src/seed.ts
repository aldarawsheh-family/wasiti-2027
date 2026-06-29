import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function seed() {
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log('بدء تهيئة المستخدمين...');

  const password = await bcrypt.hash('Wasity@2026', 12);

  const users = [
    { email: 'admin@wasity.ly', name: 'مدير المنصة' },
    { email: 'seller@wasity.ly', name: 'أحمد البائع' },
    { email: 'buyer@wasity.ly', name: 'محمد المشتري' },
  ];

  for (const user of users) {
    await db.query(
      'UPDATE users SET password_hash = $1, display_name = $2 WHERE email = $3',
      [password, user.name, user.email]
    );
    console.log('تم: ' + user.email);
  }

  console.log('كلمة السر: Wasity@2026');
  await db.end();
}

seed().catch((err: any) => {
  console.error('فشل:', err.message);
  process.exit(1);
});
