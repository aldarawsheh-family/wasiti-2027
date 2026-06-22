-- ══════════════════════════════════════════════════
-- WASITI 2027 — CATEGORIES
-- ══════════════════════════════════════════════════

CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            JSONB NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    parent_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
    icon            VARCHAR(50),
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ── فئات افتراضية ──
INSERT INTO categories (tenant_id, name, slug, icon, sort_order) VALUES
    ('00000000-0000-0000-0000-000000000001', '{"ar":"سيارات","en":"Cars"}', 'cars', '🚗', 1),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"عقارات","en":"Real Estate"}', 'real-estate', '🏠', 2),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"موبايلات","en":"Phones"}', 'phones', '📱', 3),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"خدمات","en":"Services"}', 'services', '⚡', 4),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"أثاث","en":"Furniture"}', 'furniture', '🪑', 5),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"إلكترونيات","en":"Electronics"}', 'electronics', '🖥️', 6),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"منتجات","en":"Products"}', 'products', '📦', 7),
    ('00000000-0000-0000-0000-000000000001', '{"ar":"ألعاب","en":"Games"}', 'games', '🎮', 8);

-- ── خصائص الفئات (ديناميكية) ──
CREATE TABLE category_attributes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    attribute_key   VARCHAR(100) NOT NULL,
    attribute_label JSONB NOT NULL,
    attribute_type  VARCHAR(20) DEFAULT 'text'
                    CHECK (attribute_type IN ('text', 'number', 'boolean', 'select', 'multi-select')),
    options         JSONB,
    is_required     BOOLEAN DEFAULT FALSE,
    sort_order      INT DEFAULT 0,
    UNIQUE(category_id, attribute_key)
);

CREATE INDEX idx_category_attributes ON category_attributes(category_id);