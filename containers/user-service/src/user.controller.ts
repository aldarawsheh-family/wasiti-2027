import { Controller, Get, Put, Body, Param, Headers, UseGuards, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller()
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async getUser(@Headers('tenant-id') tenantId: string, @Param('id') id: string) {
    return this.userService.getUser(tenantId, id);
  }

  @Put(':id')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async updateUser(@Headers('tenant-id') tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.userService.updateUser(tenantId, id, body);
  }

  @Put(':id/role')
  @Roles('ADMIN', 'PLATFORM_OWNER')
  async updateRole(@Headers('tenant-id') tenantId: string, @Param('id') id: string, @Body() body: { role: string }) {
    return this.userService.updateUser(tenantId, id, body);
  }

  @Get(':id/trust')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async getTrustScore(@Headers('tenant-id') tenantId: string, @Param('id') id: string) {
    return this.userService.getTrustScore(tenantId, id);
  }
}