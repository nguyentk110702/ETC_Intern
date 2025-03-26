import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: ProductEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? [
          { name: Like(`%${search}%`) },
          { skuCode: Like(`%${search}%`) },
          { barCode: Like(`%${search}%`) },
        ]
      : [{}];

    const total = await this.productRepository.count({ where: whereCondition });

    const products = await this.productRepository.find({
      where: whereCondition,
      relations: ['productVariants'],
      take: limit,
      skip: skip,
    });

    return { data: products, total, page, limit };
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['productVariants'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateData: Partial<CreateProductDto>,
  ): Promise<ProductEntity> {
    await this.productRepository.update(id, updateData);
    const updatedProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async softDelete(id: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants'], // Lấy danh sách các variants liên quan
    });

    if (!product) throw new NotFoundException('Product not found');

    // ✅ Xóa mềm Product
    product.isDelete = 1;
    await this.productRepository.save(product);

    // ✅ Xóa mềm các Variants liên quan
    if (product.productVariants?.length) {
      for (const variant of product.productVariants) {
        variant.isDelete = 1;
        await this.productRepository.save(variant);
      }
    }
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
