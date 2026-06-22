-- ══════════════════════════════════════════════════
-- WASITI 2027 — BOOKING SYSTEM
-- ══════════════════════════════════════════════════

-- ── خدمات الحجز ──
CREATE TABLE booking_services (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            JSONB NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('HOTEL', 'RESTAURANT', 'TRAVEL', 'EVENT', 'MEDICAL', 'OTHER')),
    description     JSONB DEFAULT '{}',
    logo_url        TEXT,
    cover_url       TEXT,
    location        GEOGRAPHY(POINT, 4326),
    city            JSONB DEFAULT '{}',
    address         JSONB DEFAULT '{}',
    phone           VARCHAR(20),
    whatsapp        VARCHAR(20),
    email           VARCHAR(255),
    website         VARCHAR(500),
    rating_avg      DECIMAL(3,2) DEFAULT 0,
    total_bookings  INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_booking_services_tenant ON booking_services(tenant_id);
CREATE INDEX idx_booking_services_type ON booking_services(tenant_id, type);

-- ── توفر الخدمة ──
CREATE TABLE booking_availability (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id      UUID NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
    name            JSONB NOT NULL,
    description     JSONB DEFAULT '{}',
    price           DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'LYD',
    total_slots     INT NOT NULL DEFAULT 1,
    booked_slots    INT DEFAULT 0,
    available_slots INT GENERATED ALWAYS AS (total_slots - booked_slots) STORED,
    date            DATE NOT NULL,
    start_time      TIME,
    end_time        TIME,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_id, date, start_time)
);

CREATE INDEX idx_booking_avail_service ON booking_availability(service_id);
CREATE INDEX idx_booking_avail_date ON booking_availability(service_id, date);

-- ── الحجوزات ──
CREATE TABLE booking_reservations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    availability_id UUID NOT NULL REFERENCES booking_availability(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    guest_name      VARCHAR(200) NOT NULL,
    guest_phone     VARCHAR(20),
    guest_email     VARCHAR(255),
    slots           INT DEFAULT 1,
    price_paid      DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'LYD',
    status          VARCHAR(20) DEFAULT 'CONFIRMED'
                    CHECK (status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'REFUNDED')),
    booking_code    VARCHAR(20) UNIQUE NOT NULL,
    qr_code         TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_res_availability ON booking_reservations(availability_id);
CREATE INDEX idx_booking_res_user ON booking_reservations(user_id);
CREATE INDEX idx_booking_res_code ON booking_reservations(booking_code);

-- ── الخصومات ──
CREATE TABLE booking_discounts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id      UUID NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
    name            JSONB NOT NULL,
    code            VARCHAR(50) NOT NULL,
    discount_type   VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value  DECIMAL(10,2) NOT NULL,
    min_booking_value DECIMAL(10,2) DEFAULT 0,
    max_uses        INT DEFAULT 0,
    used_count      INT DEFAULT 0,
    starts_at       TIMESTAMPTZ,
    ends_at         TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_id, code)
);

CREATE INDEX idx_booking_discounts_service ON booking_discounts(service_id);