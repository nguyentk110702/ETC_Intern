import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateVarianDto } from './dto/createVariant.dto';
import { Color } from '../../entities/entities/Color';
import { Size } from '../../entities/entities/Size';
import { Material } from '../../entities/entities/Material';
import { ProductVariant } from '../../entities/entities/ProductVariant';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductVariant)
    private readonly varianRepo: Repository<ProductVariant>,
    @InjectRepository(Color)
    private readonly colorRepo: Repository<Color>,
    @InjectRepository(Size)
    private readonly sizeRepo: Repository<Size>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
  ) {}

  async createProductVariantWithAttributes(body: CreateVarianDto) {
    // 🔹 Kiểm tra sản phẩm có tồn tại không
    const findProduct = await this.productRepository.findOne({
      where: { id: body.idProduct },
    });
    if (!findProduct) throw new NotFoundException('Product not found');

    // 🔹 Tìm thuộc tính có sẵn trong DB
    const [findColor, findSize, findMaterial] = await Promise.all([
      this.colorRepo.findOne({
        where: { name: body.color, product: { id: findProduct.id } },
      }),
      this.sizeRepo.findOne({
        where: { name: body.size, product: { id: findProduct.id } },
      }),
      this.materialRepo.findOne({
        where: { name: body.material, product: { id: findProduct.id } },
      }),
    ]);

    // 🔹 Nếu thuộc tính chưa có => tạo mới
    const [newColor, newSize, newMaterial] = await Promise.all([
      findColor ||
        this.colorRepo.save({ name: body.color, product: findProduct }),
      findSize || this.sizeRepo.save({ name: body.size, product: findProduct }),
      findMaterial ||
        this.materialRepo.save({ name: body.material, product: findProduct }),
    ]);

    // 🔹 Kiểm tra biến thể đã tồn tại chưa
    const checkVarian = await this.varianRepo.findOne({
      where: {
        color: { id: newColor.id },
        size: { id: newSize.id },
        material: { id: newMaterial.id },
        product: { id: findProduct.id },
      },
      relations: { color: true, size: true, material: true },
    });

    if (checkVarian) throw new ConflictException('Variant already exists');

    // 🔹 Tạo mới biến thể sản phẩm
    const createVarian = this.varianRepo.create({
      skuCode: body.skuCode,
      barCode: body.barCode,
      unit: body.unit,
      sellPrice: body.sellPrice,
      comparePrice: body.comparePrice,
      cost: body.cost,
      quantity: body.quantity,
      image: body.image,
      product: findProduct,
      color: newColor,
      size: newSize,
      material: newMaterial,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.varianRepo.save(createVarian);
  }

  async getProductVariantByProductId(productId: number) {
    try {
      const variants = await this.varianRepo.find({
        where: { productId },
        relations: ['product', 'color', 'size', 'material'],
      });

      if (!variants.length) {
        throw new NotFoundException(
          `No product variants found for productId ${productId}`,
        );
      }
      return variants;
    } catch (error) {
      console.error(
        `❌ Error fetching product variants: ${error.message}`,
        error,
      );
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.',
      );
    }
  }

  async remove(id: number): Promise<void> {
    await this.varianRepo.delete(id);
  }
}
