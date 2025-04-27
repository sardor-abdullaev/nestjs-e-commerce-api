import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics', description: 'The name of the category' })
    name: string;

    @ApiPropertyOptional({ example: 'Devices and gadgets', description: 'A short description of the category', required: false })
    description?: string;

    @ApiPropertyOptional({ example: 'electronics.png', description: 'Image URL for the category' })
    image?: string;

    @ApiProperty({ example: null, description: 'Parent category ID if this is a sub-category', required: false })
    parentId?: string;
}

export class CreateCategoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 'Electronics', description: 'The name of the category' })
    name: string;

    @ApiPropertyOptional({ example: 'Devices and gadgets', description: 'A short description of the category' })
    description?: string;

    @ApiPropertyOptional({ example: 'electronics.png', description: 'Image URL for the category' })
    image?: string;

    @ApiPropertyOptional({ example: '2852619e-d363-4c08-9321-f48c5b424dd2', description: 'ID of the parent category if it exists' })
    parentId?: string;
}