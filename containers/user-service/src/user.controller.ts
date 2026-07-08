import { Controller, Get, Put, Delete, Body, Param, Headers, UseGuards, SetMetadata, ForbiddenException, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { Auditable } from './common/interceptors/audit-log.interceptor';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller()
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN', 'PLATFORM_OWNER', 'SUPPORT', 'MODERATOR')
  async getUsers(@Headers('tenant-id') tenantId: string) {
    return this.userService.getUsers(tenantId);
  }

  @Get('profile')
  async getProfile(@Headers('tenant-id') tenantId: string, @Headers('user-id') userId: string) {
    return this.userService.getUser(tenantId, userId);
  }

  @Put('profile')
  async updateProfile(@Headers('tenant-id') tenantId: string, @Headers('user-id') userId: string, @Body() body: any) {
    return this.userService.updateUser(tenantId, userId, body, userId);
  }

  @Get(':id')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async getUser(@Headers('tenant-id') tenantId: string, @Param('id') id: string) {
    return this.userService.getUser(tenantId, id);
  }

  @Put(':id')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async updateUser(@Req() req: any, @Headers('tenant-id') tenantId: string, @Param('id') id: string, @Body() body: any) {
    return this.userService.updateUser(tenantId, id, body, req.headers['user-id'] || req.userId);
  }

  @Put(':id/role')
  @Roles('ADMIN', 'PLATFORM_OWNER')
  @Auditable('user.role.update')
  async updateRole(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { role: string },
    @Headers('user-role') currentUserRole: string,
    @Headers('user-id') actorId: string,
  ) {
    if (currentUserRole === 'ADMIN' && body.role === 'PLATFORM_OWNER') {
      throw new ForbiddenException('ADMIN cannot assign PLATFORM_OWNER role');
    }
    return this.userService.updateUser(tenantId, id, body, actorId);
  }

  @Delete(':id')
  @Roles('ADMIN', 'PLATFORM_OWNER')
  @Auditable('user.delete')
  async deleteUser(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Headers('user-id') actorId: string,
  ) {
    return this.userService.deleteUser(tenantId, id, actorId);
  }

  @Get(':id/trust')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async getTrustScore(@Headers('tenant-id') tenantId: string, @Param('id') id: string) {
    return this.userService.getTrustScore(tenantId, id);
  }
}