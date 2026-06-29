import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, SetMetadata } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('notifications')
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async send(@Body() body: { userId: string; type: string; title: string; body: string; link?: string }) {
    return this.notificationService.create(body);
  }

  @Get()
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async findAll(@Query('userId') userId: string) {
    return this.notificationService.findAll(userId);
  }

  @Get(':id')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id/read')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async markRead(@Param('id') id: string) {
    return this.notificationService.markRead(id);
  }

  @Patch('read-all')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async markAllRead(@Body() body: { userId: string }) {
    return this.notificationService.markAllRead(body.userId);
  }

  @Delete(':id')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}