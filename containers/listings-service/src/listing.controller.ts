import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req, Logger } from '@nestjs/common';
import { ListingService } from './listing.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard, Roles } from './common/guards/roles.guard';

@Controller('listings')
export class ListingController {
  private readonly logger = new Logger('ListingController');

  constructor(private readonly listingService: ListingService) {}

 @Get()
@UseGuards(TenantGuard)
async getAll(@Req() req: any, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.listingService.getAll(req.tenantId, limit ? parseInt(limit) : 50, offset ? parseInt(offset) : 0);
}
 @Get(':id')
@UseGuards(TenantGuard)
async getById(@Param('id') id: string, @Req() req: any) {
  return this.listingService.getById(req.tenantId, id);
}

  @Post()
  @UseGuards(AuthGuard, TenantGuard, RolesGuard)
@Roles('USER', 'SELLER', 'COMPANY_ADMIN', 'ADMIN', 'PLATFORM_OWNER')  async create(@Body() body: any, @Req() req: any) {
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
  @Delete(':id')
  @UseGuards(AuthGuard, TenantGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.listingService.delete(req.tenantId, id);
  }

}