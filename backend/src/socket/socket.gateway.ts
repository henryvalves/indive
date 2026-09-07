import { OnModuleInit } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketService } from './socket.service'

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server

  constructor(private socketService: SocketService) {}

  onModuleInit() {
    this.socketService.setServer(this.server)
  }

  @SubscribeMessage('joinOrder')
  handleJoinOrder(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { orderId } = data
    client.join(`order_${orderId}`)
    client.emit('joined', { ok: true })
  }

  @SubscribeMessage('driver:location')
  handleDriverLocation(@MessageBody() data: any) {
    const { orderId, location } = data
    this.server.to(`order_${orderId}`).emit('driver:location', { location })
  }
}
