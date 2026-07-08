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
      connectionString: process.env.DATABASE_URL || 'postgres://wasity:wasity@postgres:5432/wasity',
    });
    this.reflector = new Reflector();
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    console.log('INTERCEPTOR RUNNING');
    const request = context.switchToHttp().getRequest();

    const handler = context.getHandler();
    const classRef = context.getClass();
    const actionType = Reflect.getMetadata(AUDIT_KEY, classRef.prototype, handler.name);

    console.log('HANDLER:', handler.name);
    console.log('CLASS:', classRef.name);
    console.log('METADATA:', actionType);

    if (!actionType) {
      return next.handle();
    }

    const actorId = request.userId || request.headers['user-id'] || '00000000-0000-0000-0000-000000000000';
    const targetId = request.params?.id || null;
    const ipAddress = request.ip || 'api';

    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.db.query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_data, ip_address, tenant_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [actorId, actionType, 'unknown', targetId, JSON.stringify(data), ipAddress,
             request.tenantId || '00000000-0000-0000-0000-000000000001'],
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