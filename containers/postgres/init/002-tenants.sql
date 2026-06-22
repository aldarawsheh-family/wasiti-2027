-- ══════════════════════════════════════════════════
-- WASITI 2027 — TENANTS
-- ══════════════════════════════════════════════════

CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('INDIVIDUAL', 'COMPANY', 'MARKETPLACE')),
    logo_url        TEXT,
    settings        JSONB DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    is_active       BOOLEAN DEFAULT TRUE,
    max_users       INT DEFAULT 100,
    max_listings    INT DEFAULT 1000,
    subscription    VARCHAR(20) DEFAULT 'FREE' CHECK (subscription IN ('FREE', 'PRO', 'ENTERPRISE')),
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── مستأجر افتراضي للتطوير ──
INSERT INTO tenants (id, name, slug, type, subscription) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Default', 'default', 'MARKETPLACE', 'ENTERPRISE');