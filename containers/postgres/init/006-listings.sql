-- ==========================================================
-- WASITI 2027 — LISTINGS
-- ==========================================================

CREATE TABLE listings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    owner_id        UUID NOT NULL REFERENCES users(id),
    company_id      UUID REFERENCES companies(id) ON DELETE SET NULL,
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT DEFAULT '',
    price           DECIMAL(12,2),
    currency        VARCHAR(3) DEFAULT 'LYD',
    price_type      VARCHAR(20) DEFAULT 'FIXED'
                    CHECK (price_type IN ('FIXED', 'NEGOTIABLE', 'AUCTION')),
    city            VARCHAR(100) DEFAULT '',
    status          VARCHAR(20) DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'SOLD', 'EXPIRED', 'DRAFT', 'SUSPENDED', 'DELETED')),
    view_count      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_tenant ON listings(tenant_id);
CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created ON listings(created_at DESC);