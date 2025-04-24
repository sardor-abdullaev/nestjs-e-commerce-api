import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param, Delete } from '@nestjs/common';
import { BasketsService } from './baskets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';

@UseGuards(JwtAuthGuard)
@Controller('baskets')
export class BasketsController {
    constructor(private readonly basketsService: BasketsService) { }

    @Post('add')
    add(@Body() createBasketDto: CreateBasketDto, @Request() req) {
        return this.basketsService.addToBasket(createBasketDto, req.user);
    }

    @Get()
    getAll(@Request() req) {
        return this.basketsService.getUserBasket(req.user);
    }

    @Patch('update/:id')
    update(@Param('id') id: string, @Body() updateBasketDto: UpdateBasketDto, @Request() req) {
        return this.basketsService.updateQuantity(id, updateBasketDto, req.user);
    }

    @Delete('remove/:id')
    remove(@Param('id') id: string, @Request() req) {
        return this.basketsService.removeItem(id, req.user);
    }

    @Delete('clear')
    clear(@Request() req) {
        return this.basketsService.clearBasket(req.user);
    }
}
