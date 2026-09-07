import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DriversController } from './drivers.controller'
import { DriversService } from './drivers.service'

@Module({
  controllers: [DriversController],
  providers: [PrismaService, DriversService],
  exports: [DriversService],
})
export class DriversModule {}
