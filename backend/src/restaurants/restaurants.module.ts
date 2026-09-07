import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { RestaurantsController } from './restaurants.controller'

@Module({
  controllers: [RestaurantsController],
  providers: [PrismaService],
})
export class RestaurantsModule {}
