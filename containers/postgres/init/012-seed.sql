-- ══════════════════════════════════════════════════
-- WASITI 2027 — SEED DATA
-- ══════════════════════════════════════════════════

-- ── مستخدم افتراضي (مدير المنصة) ──
-- كلمة المرور: Admin@2027 (مشفرة)
INSERT INTO users (id, tenant_id, email, password_hash, display_name, role, is_verified) VALUES
    ('11111111-1111-1111-1111-111111111111',
     '00000000-0000-0000-0000-000000000001',
     'admin@wasity.ly',
     '$2b$12$LJ3m4ys3GqtZ5H8VqFqJWeFh5KLmNqMBxZMxqzF5Y5H9gIs7Vx0Wa',
     'مدير المنصة',
     'PLATFORM_ADMIN',
     TRUE);

-- ── مستخدم تجريبي (بائع) ──
-- كلمة المرور: Seller@2027
INSERT INTO users (id, tenant_id, email, password_hash, display_name, role, is_verified) VALUES
    ('22222222-2222-2222-2222-222222222222',
     '00000000-0000-0000-0000-000000000001',
     'seller@wasity.ly',
     '$2b$12$LJ3m4ys3GqtZ5H8VqFqJWeFh5KLmNqMBxZMxqzF5Y5H9gIs7Vx0Wa',
     'أحمد البائع',
     'SELLER',
     TRUE);

-- ── مستخدم تجريبي (مشتري) ──
-- كلمة المرور: Buyer@2027
INSERT INTO users (id, tenant_id, email, password_hash, display_name, role, is_verified) VALUES
    ('33333333-3333-3333-3333-333333333333',
     '00000000-0000-0000-0000-000000000001',
     'buyer@wasity.ly',
     '$2b$12$LJ3m4ys3GqtZ5H8VqFqJWeFh5KLmNqMBxZMxqzF5Y5H9gIs7Vx0Wa',
     'محمد المشتري',
     'USER',
     TRUE);

-- ── إعلانات تجريبية ──
INSERT INTO listings (tenant_id, owner_id, category_id, title, description, price, city, status, metadata) VALUES
    ('00000000-0000-0000-0000-000000000001',
     '22222222-2222-2222-2222-222222222222',
     (SELECT id FROM categories WHERE slug = 'cars' LIMIT 1),
     '{"ar":"مرسيدس C200 موديل 2024","en":"Mercedes C200 2024"}',
     '{"ar":"سيارة بحالة ممتازة، وارد ألمانيا","en":"Excellent condition, imported from Germany"}',
     250000,
     '{"ar":"طرابلس","en":"Tripoli"}',
     'ACTIVE',
     '{"brand":"مرسيدس","model":"C200","year":2024,"kilometers":5000,"color":"أسود","fuel":"بنزين","transmission":"أوتوماتيك"}'),

    ('00000000-0000-0000-0000-000000000001',
     '22222222-2222-2222-2222-222222222222',
     (SELECT id FROM categories WHERE slug = 'real-estate' LIMIT 1),
     '{"ar":"شقة للإيجار في وسط المدينة","en":"Apartment for rent in city center"}',
     '{"ar":"شقة 3 غرف، 2 حمام، مطلة على البحر","en":"3 bedrooms, 2 bathrooms, sea view"}',
     1500,
     '{"ar":"طرابلس","en":"Tripoli"}',
     'ACTIVE',
     '{"type":"شقة","rooms":3,"bathrooms":2,"floor":5,"area_sqm":180,"furnished":true,"has_elevator":true}'),

    ('00000000-0000-0000-0000-000000000001',
     '22222222-2222-2222-2222-222222222222',
     (SELECT id FROM categories WHERE slug = 'phones' LIMIT 1),
     '{"ar":"آيفون 16 برو ماكس","en":"iPhone 16 Pro Max"}',
     '{"ar":"جوال جديد بالكرتون، ضمان سنة","en":"Brand new, sealed, 1 year warranty"}',
     8500,
     '{"ar":"طرابلس","en":"Tripoli"}',
     'ACTIVE',
     '{"brand":"Apple","model":"iPhone 16 Pro Max","storage":"256GB","color":"ذهبي","condition":"جديد","warranty_months":12}');