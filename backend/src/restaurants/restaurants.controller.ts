import { Controller, Get, Param } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Controller('restaurants')
export class RestaurantsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.restaurant.findMany({ include: { menuItems: true } })
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.prisma.restaurant.findUnique({ where: { id }, include: { menuItems: true } })
  }
}
