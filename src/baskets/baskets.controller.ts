import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param, Delete } from '@nestjs/common';
import { BasketsService } from './baskets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('baskets')
export class BasketsController {
    constructor(private readonly basketsService: BasketsService) { }

    @UseGuards(RolesGuard)
    @Post('add')
    @Roles('user')
    add(@Body() createBasketDto: CreateBasketDto, @Request() req) {
        return this.basketsService.addToBasket(createBasketDto, req.user);
    }

    @UseGuards(RolesGuard)
    @Get()
    @Roles('user')
    getAll(@Request() req) {
        return this.basketsService.getUserBasket(req.user);
    }

    @UseGuards(RolesGuard)
    @Patch('update/:id')
    @Roles('user')
    update(@Param('id') id: string, @Body() updateBasketDto: UpdateBasketDto, @Request() req) {
        return this.basketsService.updateQuantity(id, updateBasketDto, req.user);
    }

    @UseGuards(RolesGuard)
    @Delete('remove/:id')
    @Roles('user')
    remove(@Param('id') id: string, @Request() req) {
        return this.basketsService.removeItem(id, req.user);
    }

    @UseGuards(RolesGuard)
    @Delete('clear')
    @Roles('user')
    clear(@Request() req) {
        return this.basketsService.clearBasket(req.user);
    }
}
