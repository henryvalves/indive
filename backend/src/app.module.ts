import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { RestaurantsModule } from './restaurants/restaurants.module'
import { OrdersModule } from './orders/orders.module'
import { SocketModule } from './socket/socket.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RestaurantsModule,
    OrdersModule,
    SocketModule
  ],
  providers: [PrismaService],
})
export class AppModule {}
