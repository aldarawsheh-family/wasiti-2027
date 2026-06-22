// ══════════════════════════════════════════════════
// WASITI 2027 — Chat Service — Gateway
// ══════════════════════════════════════════════════

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { RoomService } from './room.service';
import { PresenceService } from './presence.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly presenceService: PresenceService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const tenantId = client.handshake.query.tenantId as string;

    if (!userId || !tenantId) {
      client.disconnect();
      return;
    }

    client.data.userId = userId;
    client.data.tenantId = tenantId;

    await this.presenceService.setOnline(userId, client.id);
    client.join(`user:${userId}`);

    // إشعار المستخدمين الآخرين
    this.server.emit('presence:online', { userId });
    console.log(`✅ User ${userId} connected`);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      await this.presenceService.setOffline(userId);
      this.server.emit('presence:offline', { userId });
      console.log(`❌ User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string; type?: string },
  ) {
    const userId = client.data.userId;
    const tenantId = client.data.tenantId;

    const message = await this.messageService.save(
      tenantId,
      data.roomId,
      userId,
      data.content,
      data.type || 'text',
    );

    // إرسال لجميع المشاركين في الغرفة
    this.server.to(`room:${data.roomId}`).emit('message:receive', message);

    return { success: true, message };
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(`room:${data.roomId}`);
    return { success: true, roomId: data.roomId };
  }

  @SubscribeMessage('room:leave')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(`room:${data.roomId}`);
    return { success: true, roomId: data.roomId };
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const userId = client.data.userId;
    client.to(`room:${data.roomId}`).emit('typing:start', { userId, roomId: data.roomId });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const userId = client.data.userId;
    client.to(`room:${data.roomId}`).emit('typing:stop', { userId, roomId: data.roomId });
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const userId = client.data.userId;
    await this.messageService.markAsRead(data.messageId, userId);
    return { success: true };
  }
}