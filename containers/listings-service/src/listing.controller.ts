import { Controller, Post, Put, Body, Param, UseGuards, Req, Logger } from '@nestjs/common';
import { ListingService } from './listing.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard, Roles } from './common/guards/roles.guard';

@Controller('listings')
export class ListingController {
  private readonly logger = new Logger('ListingController');

  constructor(private readonly listingService: ListingService) {}

  @Post()
  @UseGuards(AuthGuard, TenantGuard, RolesGuard)
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async create(@Body() body: any, @Req() req: any) {
    const ownerId = req.userId || req.headers['user-id'];
    const tenantId = req.tenantId;
    this.logger.log('Create listing - userId:', req.userId);
    return this.listingService.create(tenantId, { ...body, ownerId });
  }

  @Put(':id')
  @UseGuards(AuthGuard, TenantGuard, RolesGuard)
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const tenantId = req.tenantId;
    return this.listingService.update(tenantId, id, body);
  }
}
