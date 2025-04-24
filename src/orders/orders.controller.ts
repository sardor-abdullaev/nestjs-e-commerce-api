import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @UseGuards(RolesGuard)
    @Post()
    @Roles('user')
    create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        return this.ordersService.createOrder(createOrderDto, req.user);
    }

    @UseGuards(RolesGuard)
    @Get()
    @Roles('admin')
    findAll() {
        return this.ordersService.findAll();
    }

    @UseGuards(RolesGuard)
    @Get('user/:id')
    @Roles('admin')
    findByUser(@Param('id') id: string, @Request() req) {
        if (req.user.id !== id && req.user.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        return this.ordersService.findByUser(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }
}

