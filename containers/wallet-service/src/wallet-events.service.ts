import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class WalletEventsService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async emit(event: string, payload: any) {
    console.log(`📡 Wallet Event: ${event}`, JSON.stringify(payload).substring(0, 100));
  }
}
