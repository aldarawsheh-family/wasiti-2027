-- ══════════════════════════════════════════════════
-- WASITI 2027 — CHAT
-- ══════════════════════════════════════════════════

-- ── غرف المحادثة ──
CREATE TABLE chat_rooms (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    listing_id      UUID REFERENCES listings(id) ON DELETE SET NULL,
    participants    UUID[] NOT NULL DEFAULT '{}',
    last_message_at TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT TRUE,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_rooms_tenant ON chat_rooms(tenant_id);
CREATE INDEX idx_chat_rooms_listing ON chat_rooms(listing_id);
CREATE INDEX idx_chat_rooms_participants ON chat_rooms USING GIN(participants);

-- ── الرسائل ──
CREATE TABLE chat_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id         UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES users(id),
    content         TEXT NOT NULL,
    type            VARCHAR(20) DEFAULT 'text'
                    CHECK (type IN ('text', 'image', 'file', 'location', 'deal_offer')),
    attachment_url  TEXT,
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(room_id, created_at DESC);