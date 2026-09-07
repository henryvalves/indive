import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async updateLocation(driverId: string, lat: number, lng: number) {
    return this.prisma.driver.update({ where: { id: driverId }, data: { currentLat: lat, currentLng: lng } })
  }

  async setAvailability(driverId: string, status: 'AVAILABLE' | 'OFFLINE' | 'BUSY') {
    return this.prisma.driver.update({ where: { id: driverId }, data: { status } })
  }

  // Find nearest available drivers to a point (lat,lng). Simple Haversine in JS after selecting candidates.
  async findNearestAvailable(lat: number, lng: number, limit = 3) {
    const drivers = await this.prisma.driver.findMany({ where: { status: 'AVAILABLE', currentLat: { not: null }, currentLng: { not: null } } })
    function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
      const R = 6371 // km
      const dLat = (b.lat - a.lat) * Math.PI / 180
      const dLon = (b.lng - a.lng) * Math.PI / 180
      const lat1 = a.lat * Math.PI / 180
      const lat2 = b.lat * Math.PI / 180
      const sinDLat = Math.sin(dLat/2)
      const sinDLon = Math.sin(dLon/2)
      const aa = sinDLat*sinDLat + sinDLon*sinDLon * Math.cos(lat1) * Math.cos(lat2)
      const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa))
      return R * c
    }
    const withDist = drivers.map(d => ({ driver: d, distanceKm: haversine({ lat, lng }, { lat: d.currentLat!, lng: d.currentLng! }) }))
    withDist.sort((a, b) => a.distanceKm - b.distanceKm)
    return withDist.slice(0, limit).map(w => ({ ...w.driver, distanceKm: w.distanceKm }))
  }

  async acceptOrder(driverId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new BadRequestException('Order not found')
    if (order.driverId) throw new BadRequestException('Order already assigned')

    // assign driver and set status to ON_THE_WAY
    const updated = await this.prisma.order.update({ where: { id: orderId }, data: { driverId, status: 'ON_THE_WAY' } })
    // set driver to BUSY
    await this.prisma.driver.update({ where: { id: driverId }, data: { status: 'BUSY' } })
    return updated
  }
}
