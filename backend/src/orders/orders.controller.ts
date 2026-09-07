import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { SocketService } from '../socket/socket.service'

@Controller()
export class OrdersController {
  constructor(private prisma: PrismaService, private socket: SocketService) {}

  @Post('checkout')
  async checkout(@Body() body: any) {
    const { customerId, items, restaurantId } = body
    const total = items.reduce((s: number, it: any) => s + it.price * (it.quantity || 1), 0)
    const order = await this.prisma.order.create({
      data: {
        customerId: customerId || '00000000-0000-0000-0000-000000000000',
        restaurantId,
        totalAmount: total,
        status: 'PENDING',
        items: { create: items.map((it: any) => ({ name: it.name, price: it.price, quantity: it.quantity || 1 })) }
      },
      include: { items: true }
    })
    this.socket.serverEmit('order:created', order)
    return { orderId: order.id }
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.prisma.order.findUnique({ where: { id }, include: { items: true, restaurant: true } })
  }
}
