-- ══════════════════════════════════════════════════
-- WASITI 2027 — TENANT TYPES & SUBSCRIPTIONS
-- ══════════════════════════════════════════════════

-- ── أنواع المستأجرين ──
CREATE TABLE tenant_types (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            JSONB NOT NULL,
    slug            VARCHAR(50) UNIQUE NOT NULL,
    description     JSONB DEFAULT '{}',
    permissions     JSONB NOT NULL DEFAULT '{}',
    max_listings        INT NOT NULL DEFAULT 5,
    max_images_per_ad   INT NOT NULL DEFAULT 3,
    max_members         INT NOT NULL DEFAULT 1,
    max_companies       INT NOT NULL DEFAULT 0,
    price_monthly       DECIMAL(10,2) DEFAULT 0,
    price_yearly        DECIMAL(10,2) DEFAULT 0,
    currency            VARCHAR(3) DEFAULT 'LYD',
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── الأنواع الخمسة ──
INSERT INTO tenant_types (name, slug, permissions, max_listings, max_images_per_ad, max_members, max_companies, price_monthly, price_yearly, sort_order) VALUES
('{"ar":"بائع فرد","en":"Individual Seller"}', 'seller',
 '{"can_create_listings":true,"can_chat":true,"can_boost":false,"can_feature":false,"has_analytics":false,"has_api":false,"has_booking":false,"has_discounts":false,"has_custom_domain":false}',
 5, 3, 1, 0, 0, 0, 1),

('{"ar":"تاجر","en":"Dealer"}', 'dealer',
 '{"can_create_listings":true,"can_chat":true,"can_boost":true,"can_feature":true,"has_analytics":true,"has_api":false,"has_booking":false,"has_discounts":true,"has_custom_domain":false}',
 500, 10, 1, 0, 150, 1500, 2),

('{"ar":"شركة","en":"Company"}', 'company',
 '{"can_create_listings":true,"can_chat":true,"can_boost":true,"can_feature":true,"has_analytics":true,"has_api":true,"has_booking":false,"has_discounts":true,"has_custom_domain":true}',
 99999, 20, 50, 10, 500, 5000, 3),

('{"ar":"خدمة حجوزات","en":"Booking Service"}', 'booking',
 '{"can_create_listings":true,"can_chat":true,"can_boost":true,"can_feature":true,"has_analytics":true,"has_api":true,"has_booking":true,"has_discounts":true,"has_custom_domain":true}',
 99999, 30, 100, 0, 500, 5000, 4),

('{"ar":"سوق","en":"Marketplace"}', 'marketplace',
 '{"can_create_listings":true,"can_chat":true,"can_boost":true,"can_feature":true,"has_analytics":true,"has_api":true,"has_booking":true,"has_discounts":true,"has_custom_domain":true,"has_white_label":true}',
 999999, 50, 500, 100, 1500, 15000, 5);

-- ── اشتراكات المستأجرين ──
CREATE TABLE tenant_subscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type_id         UUID NOT NULL REFERENCES tenant_types(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED', 'TRIAL', 'SUSPENDED')),
    billing_cycle   VARCHAR(10) NOT NULL DEFAULT 'MONTHLY'
                    CHECK (billing_cycle IN ('MONTHLY', 'YEARLY')),
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    trial_ends_at   TIMESTAMPTZ,
    listings_used   INT DEFAULT 0,
    members_used    INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenant_subs_tenant ON tenant_subscriptions(tenant_id);
CREATE INDEX idx_tenant_subs_status ON tenant_subscriptions(status);