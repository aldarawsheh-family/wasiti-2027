-- ══════════════════════════════════════════════════
-- WASITI 2027 — NOTIFICATIONS
-- ══════════════════════════════════════════════════

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL,
    title           JSONB NOT NULL,
    body            JSONB DEFAULT '{}',
    data            JSONB DEFAULT '{}',
    link            TEXT,
    icon            VARCHAR(50),
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    channel         VARCHAR(20) DEFAULT 'in_app'
                    CHECK (channel IN ('in_app', 'websocket', 'email', 'push')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX idx_notifications_created ON notifications(user_id, created_at DESC);