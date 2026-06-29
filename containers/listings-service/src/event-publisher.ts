import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class EventPublisher {
  private channel: any;

  async connect() {
    const conn = await amqp.connect('amqp://wasity:wasity_rabbit_2027@rabbitmq:5672');
    this.channel = await conn.createChannel();
    await this.channel.assertQueue('wasity.events', { durable: true });
  }

  async publish(event: string, data: any) {
    if (!this.channel) await this.connect();
    this.channel.sendToQueue('wasity.events', Buffer.from(JSON.stringify({ event, data })), {
      persistent: true
    });
    console.log(`📡 RabbitMQ Event: ${event}`);
  }
}
