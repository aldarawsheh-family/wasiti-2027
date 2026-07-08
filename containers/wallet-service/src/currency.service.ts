import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class CurrencyService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async convert(params: {
    walletId: string;
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    idempotencyKey: string;
  }) {
    const { walletId, amount, fromCurrency, toCurrency, idempotencyKey } = params;

    if (amount <= 0) {
      throw new BadRequestException("المبلغ يجب أن يكون أكبر من صفر");
    }

    if (fromCurrency === toCurrency) {
      throw new BadRequestException("لا يمكن التحويل لنفس العملة");
    }

    const existing = await this.pool.query(
      `SELECT * FROM wallet.currency_conversions WHERE idempotency_key = $1`,
      [idempotencyKey],
    );
    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const rateResult = await this.pool.query(
      `SELECT rate FROM wallet.exchange_rates WHERE from_currency = $1 AND to_currency = $2 ORDER BY effective_from DESC LIMIT 1`,
      [fromCurrency, toCurrency],
    );

    if (rateResult.rows.length === 0) {
      throw new BadRequestException(
        `لا يوجد سعر صرف مسجل من ${fromCurrency} إلى ${toCurrency}`,
      );
    }

    const rate = parseFloat(rateResult.rows[0].rate);

    const currencyResult = await this.pool.query(
      `SELECT decimal_places FROM wallet.currencies WHERE code = $1`,
      [toCurrency],
    );
    const decimalPlaces = currencyResult.rows[0]?.decimal_places ?? 2;

    const toAmount = parseFloat((amount * rate).toFixed(decimalPlaces));
    const operationId = uuidv4();

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const insertResult = await client.query(
        `INSERT INTO wallet.currency_conversions (wallet_id, from_currency, to_currency, from_amount, to_amount, rate_used, operation_id, idempotency_key) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          walletId,
          fromCurrency,
          toCurrency,
          amount,
          toAmount,
          rate,
          operationId,
          idempotencyKey,
        ],
      );

      await client.query("COMMIT");
      return insertResult.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async getLatestRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const result = await this.pool.query(
      `SELECT rate FROM wallet.exchange_rates WHERE from_currency = $1 AND to_currency = $2 ORDER BY effective_from DESC LIMIT 1`,
      [fromCurrency, toCurrency],
    );
    if (result.rows.length === 0) {
      throw new BadRequestException(
        `لا يوجد سعر صرف مسجل من ${fromCurrency} إلى ${toCurrency}`,
      );
    }
    return parseFloat(result.rows[0].rate);
  }
}
