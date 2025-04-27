import {
    Controller,
    Post,
    Get,
    Param,
    Patch,
    Delete,
    Body,
    UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, CreateCategoryResponseDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Category } from './category.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @ApiOperation({ summary: 'Create a new category(only Admin)' })
    @ApiCreatedResponse({ description: 'Category created', type: CreateCategoryResponseDto }) // @ApiResponse({ status: 201, description: 'Category created', type: CreateCategoryResponseDto })
    @ApiBadRequestResponse({ description: 'There must be a name at least' })
    @ApiNotFoundResponse({ description: 'Parent category not found' })
    @ApiUnauthorizedResponse({description:"Unauthorized"})
    @Post()
    @Roles('admin')
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: 200, description: 'List of categories.', type: [Category] })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({ status: 200, description: 'The found category.', type: Category })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Update a category (only Admin)' })
    @ApiResponse({ status: 200, description: 'Category updated successfully.', type: Category })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete a category (only Admin)' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
