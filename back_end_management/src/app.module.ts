import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ProductEntity } from './product/product.entity';
import { RoleModule } from './role/role.module';
import { AuthEntity } from './auth/auth.entity';
import { Color } from '../entities/entities/Color';
import { ProductVariant } from '../entities/entities/ProductVariant';
import { OrderItems } from '../entities/entities/OrderItems';
import { Order } from '../entities/entities/Order';
import { PaymentMethod } from '../entities/entities/PaymentMethod';
import { Size } from '../entities/entities/Size';
import { Material } from '../entities/entities/Material';
import { ProductVariantModule } from './productVariant/productVariant.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // Thay bằng username database của bạn
      password: 'abcd1234', // Thay bằng password database của bạn
      database: 'nguyentk', // Thay bằng tên database
      autoLoadEntities: true, // Tự động load các entity
      synchronize: true, // Chỉ dùng trong development (Tự động cập nhật schema)
    }),
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
    AuthModule,
    ProductModule,
    RoleModule,
    ProductVariantModule,
    OrderModule,
  ],
})
export class AppModule {}
