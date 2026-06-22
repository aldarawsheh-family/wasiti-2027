-- ══════════════════════════════════════════════════
-- WASITI 2027 — COMPANIES
-- ══════════════════════════════════════════════════

CREATE TABLE companies (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(100),
    type            VARCHAR(20) NOT NULL CHECK (type IN ('DEALER', 'SHOP', 'ENTERPRISE')),
    description     JSONB DEFAULT '{}',
    logo_url        TEXT,
    cover_url       TEXT,
    website         VARCHAR(500),
    phone           VARCHAR(20),
    email           VARCHAR(255),
    location        GEOGRAPHY(POINT, 4326),
    address         JSONB DEFAULT '{}',
    verified        BOOLEAN DEFAULT FALSE,
    owner_id        UUID NOT NULL REFERENCES users(id),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_companies_tenant ON companies(tenant_id);
CREATE INDEX idx_companies_owner ON companies(owner_id);
CREATE INDEX idx_companies_type ON companies(tenant_id, type);

-- ── أعضاء الشركات ──
CREATE TABLE company_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL DEFAULT 'MEMBER'
                    CHECK (role IN ('ADMIN', 'MANAGER', 'MEMBER')),
    permissions     JSONB DEFAULT '[]',
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

CREATE INDEX idx_company_members_user ON company_members(user_id);