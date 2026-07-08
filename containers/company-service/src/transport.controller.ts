import { Auditable } from './common/interceptors/audit-log.interceptor';
import { Controller, Get, Post, Delete, Body, Param, Headers, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantScopeGuard } from './common/guards/tenant-scope.guard';
import { Pool } from 'pg';

@Controller('transport')
@UseGuards(AuthGuard, TenantGuard, RolesGuard, TenantScopeGuard)
export class TransportController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://wasity:wasity@postgres:5432/wasity',
    });
  }

  // Vehicles
  @Get(':id/vehicles')
  async getVehicles(@Param('id') companyId: string) {
    const result = await this.db.query(
      `SELECT v.*, f.fleet_name FROM company.transport_vehicles v 
       JOIN company.transport_fleets f ON v.fleet_id = f.id 
       WHERE f.company_id = $1 AND v.deleted_at IS NULL`,
      [companyId],
    );
    return result.rows;
  }

  @Post(':id/vehicles')
  async createVehicle(@Param('id') companyId: string, @Body() body: any) {
    let fleet = await this.db.query(
      'SELECT id FROM company.transport_fleets WHERE company_id = $1 LIMIT 1', [companyId]
    );
    if (fleet.rows.length === 0) {
      fleet = await this.db.query(
        `INSERT INTO company.transport_fleets (company_id, fleet_name) VALUES ($1, $2) RETURNING id`,
        [companyId, 'الأسطول الرئيسي']
      );
    }
    const fleetId = fleet.rows[0].id;

    const result = await this.db.query(
      `INSERT INTO company.transport_vehicles (fleet_id, plate_number, vehicle_type, total_seats)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [fleetId, body.plateNumber, body.vehicleType, body.totalSeats],
    );
    return result.rows[0];
  }

  @Delete('vehicles/:vehicleId')
  @Auditable('vehicle.delete')
  async deleteVehicle(@Param('vehicleId') vehicleId: string, @Headers('user-id') actorId: string) {
    const result = await this.db.query(
      `UPDATE company.transport_vehicles SET deleted_at = NOW(), deleted_by = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id`,
      [actorId || '2adb6ac3-57fc-4e5e-87f9-c3e1a678a7f6', vehicleId],
    );
    if (result.rows.length === 0) throw new NotFoundException('Vehicle not found');
    return { message: 'Vehicle deleted (soft)', id: vehicleId };
  }

  // Trips
  @Get('vehicles/:vehicleId/trips')
  async getTrips(@Param('vehicleId') vehicleId: string) {
    const result = await this.db.query(
      'SELECT * FROM company.transport_trips WHERE vehicle_id = $1 AND deleted_at IS NULL ORDER BY departure_time',
      [vehicleId],
    );
    return result.rows;
  }

  @Post('vehicles/:vehicleId/trips')
  async createTrip(@Param('vehicleId') vehicleId: string, @Body() body: any) {
    const result = await this.db.query(
      `INSERT INTO company.transport_trips (vehicle_id, origin_city, destination_city, departure_time, arrival_time, price_per_seat, seats_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [vehicleId, body.originCity, body.destinationCity, body.departureTime, body.arrivalTime, body.pricePerSeat, body.seatsAvailable],
    );
    return result.rows[0];
  }

  // Bookings
  @Post('trips/:tripId/bookings')
  async createBooking(@Param('tripId') tripId: string, @Body() body: any) {
    const trip = await this.db.query(
      'SELECT * FROM company.transport_trips WHERE id = $1 AND deleted_at IS NULL',
      [tripId],
    );
    if (trip.rows.length === 0) throw new NotFoundException('Trip not found');
    if (trip.rows[0].seats_available < body.seatsBooked) throw new BadRequestException('No seats available');

    await this.db.query(
      'UPDATE company.transport_trips SET seats_available = seats_available - $1 WHERE id = $2',
      [body.seatsBooked, tripId],
    );

    const result = await this.db.query(
      `INSERT INTO company.transport_bookings (trip_id, passenger_user_id, passenger_full_name, passenger_phone, seats_booked, total_price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [tripId, body.userId || '00000000-0000-0000-0000-000000000000', body.passengerFullName, body.passengerPhone, body.seatsBooked, body.seatsBooked * trip.rows[0].price_per_seat],
    );
    return result.rows[0];
  }
}