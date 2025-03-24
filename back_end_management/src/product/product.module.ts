import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductController } from './product.controller';
import { AuthEntity } from '../auth/auth.entity';
import { Color } from '../../entities/entities/Color';
import { ProductVariant } from '../../entities/entities/ProductVariant';
import { OrderItems } from '../../entities/entities/OrderItems';
import { Order } from '../../entities/entities/Order';
import { PaymentMethod } from '../../entities/entities/PaymentMethod';
import { Size } from '../../entities/entities/Size';
import { Material } from '../../entities/entities/Material';
import { ProductsService } from './product.service';

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
  controllers: [ProductController],
  providers: [ProductsService],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductModule {}
