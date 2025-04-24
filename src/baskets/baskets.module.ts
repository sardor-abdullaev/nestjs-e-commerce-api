import { Module } from '@nestjs/common';
import { BasketsController } from './baskets.controller';
import { BasketsService } from './baskets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './basket.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Basket, Product])],
  controllers: [BasketsController],
  providers: [BasketsService]
})
export class BasketsModule { }
