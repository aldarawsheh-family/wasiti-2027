import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class LimitsService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async checkWithdrawalLimit(userId: string, amount: number): Promise<void> {
    let limits = await this.pool.query(
      "SELECT * FROM wallet.withdrawal_limits WHERE user_id = $1",
      [userId]
    );

    if (!limits.rows.length) {
      limits = await this.pool.query(
        `INSERT INTO wallet.withdrawal_limits (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
    }

    const limit = limits.rows[0];

    if (amount > parseFloat(limit.remaining_daily)) {
      throw new BadRequestException(`تجاوزت حد السحب اليومي (${limit.remaining_daily})`);
    }
    if (amount > parseFloat(limit.remaining_monthly)) {
      throw new BadRequestException(`تجاوزت حد السحب الشهري (${limit.remaining_monthly})`);
    }
  }

  async deductFromLimit(userId: string, amount: number): Promise<void> {
    await this.pool.query(
      `UPDATE wallet.withdrawal_limits 
       SET remaining_daily = remaining_daily - $1, remaining_monthly = remaining_monthly - $1, updated_at = NOW()
       WHERE user_id = $2`,
      [amount, userId]
    );
  }
}
