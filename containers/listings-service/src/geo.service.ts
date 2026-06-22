// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — Geo Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class GeoService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async searchNearby(lat: number, lng: number, radiusKm: number = 10, tenantId: string) {
    const result = await this.db.query(
      `SELECT l.*, 
              ST_Distance(l.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000 AS distance_km
       FROM listings l
       WHERE l.tenant_id = $3
         AND l.status = 'ACTIVE'
         AND ST_DWithin(l.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $4 * 1000)
       ORDER BY distance_km
       LIMIT 50`,
      [lng, lat, tenantId, radiusKm],
    );

    return result.rows;
  }

  async updateLocation(listingId: string, lat: number, lng: number) {
    await this.db.query(
      `UPDATE listings
       SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)
       WHERE id = $3`,
      [lng, lat, listingId],
    );
  }
}