export class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
    image?: string;
  }
  