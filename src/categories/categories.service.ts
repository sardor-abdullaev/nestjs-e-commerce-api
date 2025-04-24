import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepo.create(createCategoryDto);

        if (createCategoryDto.parentId) {
            const parent = await this.categoryRepo.findOneBy({ id: createCategoryDto.parentId });
            if (!parent) throw new NotFoundException('Parent category not found');
            category.parent = parent;
        }

        return this.categoryRepo.save(category);
    }

    findAll(): Promise<Category[]> {
        return this.categoryRepo.find({
            relations: ['parent', 'children', 'products'],
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepo.findOne({
            where: { id },
            relations: ['parent', 'children','products'],
        });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) throw new NotFoundException('Category not found');

        Object.assign(category, updateCategoryDto);

        if (updateCategoryDto.parentId) {
            const parent = await this.categoryRepo.findOneBy({ id: updateCategoryDto.parentId });
            if (!parent) throw new NotFoundException('Parent category not found');
            category.parent = parent;
        }

        return this.categoryRepo.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) throw new NotFoundException('Category not found');

        await this.categoryRepo.remove(category);
    }
}
