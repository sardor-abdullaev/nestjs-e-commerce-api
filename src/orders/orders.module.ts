import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Basket } from '../baskets/basket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Basket])],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule { }
