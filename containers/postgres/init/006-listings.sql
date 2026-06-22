مفهوم. من الآن فصاعداً: الكود أولاً، ثم المسار في الأسفل.

📄 الملف التالي:
```sql
-- ══════════════════════════════════════════════════
-- WASITI 2027 — LISTINGS
-- ══════════════════════════════════════════════════

CREATE TABLE listings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    owner_id        UUID NOT NULL REFERENCES users(id),
    company_id      UUID REFERENCES companies(id) ON DELETE SET NULL,
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    title           JSONB NOT NULL,
    description     JSONB DEFAULT '{}',
    price           DECIMAL(12,2),
    currency        VARCHAR(3) DEFAULT 'LYD',
    price_type      VARCHAR(20) DEFAULT 'FIXED'
                    CHECK (price_type IN ('FIXED', 'NEGOTIABLE', 'AUCTION')),
    location        GEOGRAPHY(POINT, 4326),
    city            JSONB DEFAULT '{}',
    district        JSONB DEFAULT '{}',
    address         JSONB DEFAULT '{}',
    images          TEXT[] DEFAULT '{}',
    video_url       TEXT,
    status          VARCHAR(20) DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'SOLD', 'EXPIRED', 'DRAFT', 'SUSPENDED', 'DELETED')),
    is_boosted      BOOLEAN DEFAULT FALSE,
    boost_until     TIMESTAMPTZ,
    is_featured     BOOLEAN DEFAULT FALSE,
    view_count      INT DEFAULT 0,
    favorite_count  INT DEFAULT 0,
    contact_count   INT DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── الفهارس ──
CREATE INDEX idx_listings_tenant ON listings(tenant_id);
CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_company ON listings(company_id);
CREATE INDEX idx_listings_status ON listings(tenant_id, status);
CREATE INDEX idx_listings_category ON listings(tenant_id, category_id);
CREATE INDEX idx_listings_price ON listings(tenant_id, price);
CREATE INDEX idx_listings_location ON listings USING GIST(location);
CREATE INDEX idx_listings_created ON listings(tenant_id, created_at DESC);
CREATE INDEX idx_listings_featured ON listings(tenant_id, is_featured);
CREATE INDEX idx_listings_title ON listings USING GIN(title);