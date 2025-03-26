import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { AuthEntity } from '../auth/auth.entity';
import { Color } from '../../entities/entities/Color';
import { ProductVariant } from '../../entities/entities/ProductVariant';
import { OrderItems } from '../../entities/entities/OrderItems';
import { Order } from '../../entities/entities/Order';
import { PaymentMethod } from '../../entities/entities/PaymentMethod';
import { Size } from '../../entities/entities/Size';
import { Material } from '../../entities/entities/Material';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

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
  controllers: [OrderController],
  providers: [OrderService],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
