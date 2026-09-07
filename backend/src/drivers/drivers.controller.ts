import { Body, Controller, Param, Post } from '@nestjs/common'
import { DriversService } from './drivers.service'
import { SocketService } from '../socket/socket.service'

@Controller('drivers')
export class DriversController {
  constructor(private drivers: DriversService, private socket: SocketService) {}

  @Post(':id/location')
  async updateLocation(@Param('id') id: string, @Body() body: { lat: number; lng: number; orderId?: string }) {
    const updated = await this.drivers.updateLocation(id, body.lat, body.lng)
    // if driver is assigned to an order, emit location to that order room
    if (body.orderId) {
      this.socket.server?.to(`order_${body.orderId}`).emit('driver:location', { location: { lat: body.lat, lng: body.lng } })
    }
    // also emit to driver room for monitoring
    this.socket.server?.to(`driver_${id}`).emit('location:updated', { lat: body.lat, lng: body.lng })
    return updated
  }

  @Post(':id/availability')
  async setAvailability(@Param('id') id: string, @Body() body: { status: 'AVAILABLE' | 'OFFLINE' | 'BUSY' }) {
    return this.drivers.setAvailability(id, body.status)
  }

  @Post(':id/accept-order')
  async acceptOrder(@Param('id') id: string, @Body() body: { orderId: string }) {
    const updated = await this.drivers.acceptOrder(id, body.orderId)
    // notify order room that driver accepted
    this.socket.server?.to(`order_${body.orderId}`).emit('order:driverAssigned', { order: updated })
    return updated
  }
}
