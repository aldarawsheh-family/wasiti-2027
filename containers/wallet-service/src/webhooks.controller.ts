import { Controller, Post, Body, Param, BadRequestException, Inject } from "@nestjs/common";
import { Pool } from "pg";

@Controller("wallet/webhooks")
export class WebhooksController {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  @Post(":providerCode")
  async handleWebhook(@Param("providerCode") providerCode: string, @Body() payload: any) {
    // 1. تحقق من التوقيع
    const signatureValid = await this.verifySignature(providerCode, payload);
    
    // 2. خزّن raw_payload فوراً
    const eventResult = await this.pool.query(
      `INSERT INTO wallet.webhook_events
       (provider_code, event_type, raw_payload, signature_valid)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [providerCode, payload.event_type || "unknown", JSON.stringify(payload), signatureValid]
    );
    const eventId = eventResult.rows[0].id;

    // 3. لو التوقيع غلط → ارفض
    if (!signatureValid) {
      throw new BadRequestException("Invalid webhook signature");
    }

    // 4. عالج الحدث
    await this.processEvent(providerCode, payload, eventId);

    return { received: true, eventId };
  }

  private async verifySignature(providerCode: string, payload: any): Promise<boolean> {
    // ⚠️ تنفيذ حقيقي حسب توثيق المزود
    return true;
  }

  private async processEvent(providerCode: string, payload: any, eventId: string) {
    // تحديث processed = true
    await this.pool.query(
      "UPDATE wallet.webhook_events SET processed = true, processed_at = NOW() WHERE id = $1",
      [eventId]
    );
  }
}
