import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Basket } from '../baskets/basket.entity';
import { User } from '../users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(Basket) private basketRepo: Repository<Basket>,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto, user: User) {
        const basketItems = await this.basketRepo.find({
            where: { user: { id: user.id } },
            relations: ['product'],
        });

        if (!basketItems.length) throw new NotFoundException('Basket is empty');

        const orders = basketItems.map(item =>
            this.orderRepo.create({
                user,
                product: item.product,
                quantity: item.quantity,
                status: createOrderDto.status || 'pending',
            }),
        );

        await this.orderRepo.save(orders);
        await this.basketRepo.delete({ user: { id: user.id } }); // clear basket

        return orders;
    }

    findAll() {
        return this.orderRepo.find({ relations: ['user', 'product'] });
    }

    findByUser(userId: string) {
        return this.orderRepo.find({
            where: { user: { id: userId } },
            relations: ['product'],
        });
    }

    findOne(id: string) {
        return this.orderRepo.findOne({
            where: { id },
            relations: ['user', 'product'],
        });
    }
}

