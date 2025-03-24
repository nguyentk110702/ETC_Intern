import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from '../auth/auth.entity';
import { Color } from '../../entities/entities/Color';
import { ProductVariant } from '../../entities/entities/ProductVariant';
import { OrderItems } from '../../entities/entities/OrderItems';
import { Order } from '../../entities/entities/Order';
import { PaymentMethod } from '../../entities/entities/PaymentMethod';
import { Size } from '../../entities/entities/Size';
import { Material } from '../../entities/entities/Material';
import { ProductVariantController } from './productVariant.controller';
import { ProductVariantService } from './productVariant.service';
import { Module } from '@nestjs/common';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      AuthEntity,
      Color,
      ProductVariant,
      OrderItems,
      Order,
      PaymentMethod,
      Size,
      Material,
    ]),
  ],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [TypeOrmModule, ProductVariantService],
})
export class ProductVariantModule {}
