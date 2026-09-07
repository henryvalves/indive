@@
 @WebSocketGateway({ cors: { origin: '*' } })
 export class SocketGateway implements OnModuleInit {
   @WebSocketServer()
   server: Server
@@
   }
 
   @SubscribeMessage('joinOrder')
   handleJoinOrder(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
     const { orderId } = data
     client.join(`order_${orderId}`)
     client.emit('joined', { ok: true })
   }
+
+  @SubscribeMessage('driver:join')
+  handleDriverJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
+    const { driverId } = data
+    client.join(`driver_${driverId}`)
+    client.emit('joinedDriver', { ok: true })
+  }
@@
   @SubscribeMessage('driver:location')
   handleDriverLocation(@MessageBody() data: any) {
     const { orderId, location } = data
     // emit to order room
     this.server.to(`order_${orderId}`).emit('driver:location', { location })
   }
 }
