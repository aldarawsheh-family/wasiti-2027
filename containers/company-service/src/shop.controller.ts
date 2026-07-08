import { Controller, Get, Post, Delete, Body, Param, Headers, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantScopeGuard } from './common/guards/tenant-scope.guard';
import { Pool } from 'pg';

@Controller('shop')
@UseGuards(AuthGuard, TenantGuard, RolesGuard, TenantScopeGuard)
export class ShopController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://wasity:wasity@postgres:5432/wasity',
    });
  }

  @Get(':id/products')
  async getProducts(@Param('id') companyId: string) {
    const result = await this.db.query(
      'SELECT * FROM company.shop_products WHERE company_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
      [companyId],
    );
    return result.rows;
  }

  @Post(':id/products')
  async createProduct(@Param('id') companyId: string, @Body() body: any) {
    const result = await this.db.query(
      `INSERT INTO company.shop_products (company_id, name, description, price, stock_quantity)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [companyId, body.name, body.description, body.price, body.stockQuantity || 0],
    );
    return result.rows[0];
  }

  @Delete('products/:productId')
  async deleteProduct(@Param('productId') productId: string, @Headers('user-id') actorId: string) {
    const result = await this.db.query(
      `UPDATE company.shop_products SET deleted_at = NOW(), deleted_by = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id`,
      [actorId || '2adb6ac3-57fc-4e5e-87f9-c3e1a678a7f6', productId],
    );
    if (result.rows.length === 0) throw new NotFoundException('Product not found');
    return { message: 'Product deleted (soft)', id: productId };
  }

  @Get('products/:productId/orders')
  async getOrders(@Param('productId') productId: string) {
    const result = await this.db.query(
      'SELECT * FROM company.shop_orders WHERE product_id = $1 ORDER BY created_at DESC',
      [productId],
    );
    return result.rows;
  }
}