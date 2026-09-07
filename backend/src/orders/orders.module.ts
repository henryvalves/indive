import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrdersController } from './orders.controller'
import { SocketModule } from '../socket/socket.module'

@Module({
  imports: [SocketModule],
  controllers: [OrdersController],
  providers: [PrismaService],
})
export class OrdersModule {}
