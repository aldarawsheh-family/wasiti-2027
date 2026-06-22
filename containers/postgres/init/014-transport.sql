-- ══════════════════════════════════════════════════
-- WASITI 2027 — TRANSPORT SYSTEM
-- ══════════════════════════════════════════════════

-- ── شركات النقل ──
CREATE TABLE transport_companies (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            JSONB NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    description     JSONB DEFAULT '{}',
    logo_url        TEXT,
    transport_type  VARCHAR(20) NOT NULL CHECK (transport_type IN ('BUS', 'MINIBUS', 'VAN', 'TAXI', 'TRUCK', 'SHIPPING')),
    phone           VARCHAR(20),
    whatsapp        VARCHAR(20),
    email           VARCHAR(255),
    rating_avg      DECIMAL(3,2) DEFAULT 0,
    total_trips     INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_transport_companies_tenant ON transport_companies(tenant_id);

-- ── المسارات ──
CREATE TABLE transport_routes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES transport_companies(id) ON DELETE CASCADE,
    from_city       JSONB NOT NULL,
    to_city         JSONB NOT NULL,
    stops           JSONB DEFAULT '[]',
    distance_km     DECIMAL(8,2),
    duration_minutes INT,
    base_price      DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'LYD',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, from_city, to_city)
);

CREATE INDEX idx_transport_routes_company ON transport_routes(company_id);

-- ── المركبات ──
CREATE TABLE transport_vehicles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES transport_companies(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('BUS', 'MINIBUS', 'VAN', 'TAXI', 'TRUCK')),
    plate_number    VARCHAR(20),
    total_seats     INT NOT NULL DEFAULT 20,
    has_classes     BOOLEAN DEFAULT FALSE,
    has_wifi        BOOLEAN DEFAULT FALSE,
    has_ac          BOOLEAN DEFAULT TRUE,
    has_tv          BOOLEAN DEFAULT FALSE,
    has_usb         BOOLEAN DEFAULT FALSE,
    has_toilet      BOOLEAN DEFAULT FALSE,
    images          TEXT[] DEFAULT '{}',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transport_vehicles_company ON transport_vehicles(company_id);

-- ── درجات المقاعد ──
CREATE TABLE seat_classes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES transport_companies(id) ON DELETE CASCADE,
    name            JSONB NOT NULL,
    price_multiplier DECIMAL(3,2) DEFAULT 1.00,
    features        JSONB DEFAULT '{}',
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_seat_classes_company ON seat_classes(company_id);

-- ── الرحلات ──
CREATE TABLE transport_trips (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES transport_companies(id) ON DELETE CASCADE,
    route_id        UUID NOT NULL REFERENCES transport_routes(id),
    vehicle_id      UUID NOT NULL REFERENCES transport_vehicles(id),
    departure_date  DATE NOT NULL,
    departure_time  TIME NOT NULL,
    arrival_date    DATE NOT NULL,
    arrival_time    TIME NOT NULL,
    total_seats     INT NOT NULL,
    booked_seats    INT DEFAULT 0,
    available_seats INT GENERATED ALWAYS AS (total_seats - booked_seats) STORED,
    base_price      DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'LYD',
    status          VARCHAR(20) DEFAULT 'SCHEDULED'
                    CHECK (status IN ('SCHEDULED', 'BOARDING', 'DEPARTED', 'COMPLETED', 'CANCELLED')),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trips_route_date ON transport_trips(route_id, departure_date);
CREATE INDEX idx_trips_company ON transport_trips(company_id);
CREATE INDEX idx_trips_status ON transport_trips(status);

-- ── الحجوزات ──
CREATE TABLE transport_bookings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id         UUID NOT NULL REFERENCES transport_trips(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    seat_number     INT NOT NULL,
    seat_class_id   UUID REFERENCES seat_classes(id),
    passenger_name  VARCHAR(200) NOT NULL,
    passenger_phone VARCHAR(20),
    price_paid      DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'LYD',
    pickup_point    JSONB,
    dropoff_point   JSONB,
    status          VARCHAR(20) DEFAULT 'CONFIRMED'
                    CHECK (status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'NO_SHOW', 'CANCELLED', 'REFUNDED')),
    booking_code    VARCHAR(20) UNIQUE NOT NULL,
    qr_code         TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_trip ON transport_bookings(trip_id);
CREATE INDEX idx_bookings_user ON transport_bookings(user_id);
CREATE INDEX idx_bookings_code ON transport_bookings(booking_code);