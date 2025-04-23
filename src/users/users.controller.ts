import {
    Controller,
    Get,
    Param,
    Patch,
    Delete,
    Body,
    UseGuards,
    Request,
    ForbiddenException,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    // Admin only
    @Get()
    @Roles('admin')
    findAll() {
      return this.usersService.();
    }
  
    // Admin or the user themselves
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
      const user = req.user;
      if (user.role !== 'admin' && user.sub !== id) {
        throw new ForbiddenException('Access denied');
      }
      return this.usersService.findOne(id);
    }
  
    // User can update their own profile
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req) {
      const user = req.user;
      if (user.sub !== id) {
        throw new ForbiddenException('You can only update your own profile');
      }
      return this.usersService.update(id, dto);
    }
  
    // Admin or the user themselves can delete
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
      const user = req.user;
      if (user.role !== 'admin' && user.sub !== id) {
        throw new ForbiddenException('You can only delete your own account');
      }
      return this.usersService.remove(id);
    }
  }
