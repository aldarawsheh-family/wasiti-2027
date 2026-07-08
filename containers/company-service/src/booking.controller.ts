import { Controller, Get, Post, Delete, Body, Param, Headers, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantScopeGuard } from './common/guards/tenant-scope.guard';
import { Pool } from 'pg';

@Controller('booking')
@UseGuards(AuthGuard, TenantGuard, RolesGuard, TenantScopeGuard)
export class BookingController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://wasity:wasity@postgres:5432/wasity',
    });
  }

  // Hotel Properties
  @Get(':id/properties')
  async getProperties(@Param('id') companyId: string) {
    const result = await this.db.query(
      'SELECT * FROM company.hotel_properties WHERE company_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
      [companyId],
    );
    return result.rows;
  }

  @Post(':id/properties')
  async createProperty(@Param('id') companyId: string, @Body() body: any) {
    const result = await this.db.query(
      `INSERT INTO company.hotel_properties (company_id, name, description, city, address, star_rating, amenities)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [companyId, body.name, body.description, body.city, body.address, body.starRating, JSON.stringify(body.amenities || [])],
    );
    return result.rows[0];
  }

  @Delete('properties/:propertyId')
  async deleteProperty(@Param('propertyId') propertyId: string, @Headers('user-id') actorId: string) {
    const result = await this.db.query(
      `UPDATE company.hotel_properties SET deleted_at = NOW(), deleted_by = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id`,
      [actorId || '2adb6ac3-57fc-4e5e-87f9-c3e1a678a7f6', propertyId],
    );
    if (result.rows.length === 0) throw new NotFoundException('Property not found');
    return { message: 'Property deleted (soft)', id: propertyId };
  }

  // Rooms
  @Get('properties/:propertyId/rooms')
  async getRooms(@Param('propertyId') propertyId: string) {
    const result = await this.db.query(
      'SELECT * FROM company.hotel_rooms WHERE property_id = $1 AND deleted_at IS NULL',
      [propertyId],
    );
    return result.rows;
  }

  @Post('properties/:propertyId/rooms')
  async createRoom(@Param('propertyId') propertyId: string, @Body() body: any) {
    const result = await this.db.query(
      `INSERT INTO company.hotel_rooms (property_id, room_type, price_per_night, quantity, view_type, max_guests)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [propertyId, body.roomType, body.pricePerNight, body.quantity, body.viewType, body.maxGuests],
    );
    return result.rows[0];
  }

  // Reservations
  @Post('rooms/:roomId/reservations')
  async createReservation(@Param('roomId') roomId: string, @Body() body: any) {
    try {
      const result = await this.db.query(
        `INSERT INTO company.hotel_reservations (room_id, guest_user_id, check_in, check_out, guests_count, total_price)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [roomId, body.userId || '2adb6ac3-57fc-4e5e-87f9-c3e1a678a7f6', body.checkIn, body.checkOut, body.guestsCount, body.totalPrice],
      );
      return result.rows[0];
    } catch (err: any) {
      if (err.message?.includes('conflicting') || err.detail?.includes('conflicting')) {
        throw new BadRequestException('Room already booked for these dates (EXCLUDE constraint)');
      }
      throw new BadRequestException(err.message || 'Booking failed');
    }
  }
}