import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Pool } from 'pg';
import { Reflector } from '@nestjs/core';

export const AUDIT_KEY = 'audit_action';
export const Auditable = (action: string) => SetMetadata(AUDIT_KEY, action);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private db: Pool;
  private reflector: Reflector;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL?.replace('localhost', 'postgres') || 'postgres://wasity:iLIvcp1R4dmO8zUbGF75Pt6kjQDVXYJN@postgres:5432/wasity',
    });
    this.reflector = new Reflector();
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const actionType = this.reflector.getAllAndOverride<string>(AUDIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const entityType = context.getClass().name.replace('Controller', '').toLowerCase();

    console.log('HANDLER:', context.getHandler().name);
    console.log('CLASS:', context.getClass().name);
    console.log('METADATA:', actionType);
    console.log('ENTITY_TYPE:', entityType);

    if (!actionType) {
      return next.handle();
    }

    const actorId = request.userId || request.headers['user-id'] || 'system';
    const targetId = request.params?.id || request.params?.vehicleId || request.params?.productId || null;
    const ipAddress = request.ip || 'api';

    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.db.query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_data, ip_address, tenant_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [actorId, actionType, entityType, targetId, JSON.stringify(data), ipAddress,
             request.tenantId || request.headers['tenant-id'] || '00000000-0000-0000-0000-000000000001'],
          );
        } catch (err) {
          console.error('Audit log failed:', err);
        }
      }),
      catchError(async (error) => {
        throw error;
      }),
    );
  }
}