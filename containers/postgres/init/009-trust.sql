-- ══════════════════════════════════════════════════
-- WASITI 2027 — TRUST & REVIEWS
-- ══════════════════════════════════════════════════

-- ── التقييمات ──
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    deal_id         UUID REFERENCES deals(id) ON DELETE SET NULL,
    reviewer_id     UUID NOT NULL REFERENCES users(id),
    reviewed_id     UUID NOT NULL REFERENCES users(id),
    rating          INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment         TEXT,
    is_public       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(deal_id, reviewer_id)
);

CREATE INDEX idx_reviews_tenant ON reviews(tenant_id);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX idx_reviews_rating ON reviews(reviewed_id, rating DESC);

-- ── الشارات ──
CREATE TABLE badges (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            JSONB NOT NULL,
    slug            VARCHAR(50) NOT NULL,
    icon            VARCHAR(50),
    description     JSONB DEFAULT '{}',
    criteria        JSONB NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

-- ── شارات المستخدمين ──
CREATE TABLE user_badges (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id        UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- ── شارات افتراضية ──
INSERT INTO badges (tenant_id, name, slug, icon, description, criteria) VALUES
    ('00000000-0000-0000-0000-000000000001', '{"ar":"موثوق","en":"Verified"}', 'verified', '✅', '{"ar":"مستخدم موثق","en":"Verified user"}', '{"type":"verification"}'),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"بائع موثوق","en":"Trusted Seller"}', 'trusted-seller', '⭐', '{"ar":"بائع موثوق","en":"Trusted seller"}', '{"min_rating":4.5,"min_deals":10}'),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"شركة موثقة","en":"Corporate Verified"}', 'corporate', '🏢', '{"ar":"شركة موثقة","en":"Corporate verified"}', '{"type":"company_verified"}');