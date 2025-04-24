import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Basket } from './basket.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';

@Injectable()
export class BasketsService {
    constructor(
        @InjectRepository(Basket)
        private basketRepo: Repository<Basket>,
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
    ) { }

    async addToBasket(createBasketDto: CreateBasketDto, user: User) {
        const product = await this.productRepo.findOneBy({ id: createBasketDto.productId });
        if (!product) throw new NotFoundException('Product not found');

        let basketItem = await this.basketRepo.findOne({
            where: { user: { id: user.id }, product: { id: createBasketDto.productId } },
        });

        if (basketItem) {
            basketItem.quantity += createBasketDto.quantity;
        } else {
            basketItem = this.basketRepo.create({
                user,
                product,
                quantity: createBasketDto.quantity,
            });
        }

        return this.basketRepo.save(basketItem);
    }

    getUserBasket(user: User) {
        return this.basketRepo.find({ where: { user: { id: user.id } } });
    }

    async updateQuantity(id: string, updateBasketDto: UpdateBasketDto, user: User) {
        const item = await this.basketRepo.findOne({
            where: { id, user: { id: user.id } },
        });

        if (!item) throw new NotFoundException('Basket item not found');

        item.quantity = updateBasketDto.quantity;
        return this.basketRepo.save(item);
    }

    async removeItem(id: string, user: User) {
        const item = await this.basketRepo.findOne({
            where: { id, user: { id: user.id } },
        });
        if (!item) throw new NotFoundException('Basket item not found');

        return this.basketRepo.remove(item);
    }

    async clearBasket(user: User) {
        return this.basketRepo.delete({ user: { id: user.id } });
    }
}
