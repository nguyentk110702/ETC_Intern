import { DataSource } from 'typeorm';
import { Order } from '../entities/entities/Order';
import { OrderItems } from '../entities/entities/OrderItems';
import { PaymentMethod } from '../entities/entities/PaymentMethod';
import { ProductEntity } from './product/product.entity';
import { ProductVariant } from '../entities/entities/ProductVariant';
import { Size } from '../entities/entities/Size';
import { AuthEntity } from './auth/auth.entity';
import { RoleEntity } from './role/role.entity';
import { Color } from '../entities/entities/Color';
import { Material } from '../entities/entities/Material';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'abcd1234',
  database: 'nguyentk',
  synchronize: false,
  entities: [
    Color,
    Material,
    Order,
    OrderItems,
    PaymentMethod,
    ProductEntity,
    ProductVariant,
    Size,
    AuthEntity,
    RoleEntity,
  ],
  migrations: ['src/migrations/*.ts'], // ✅ Đảm bảo có thư mục migrations
  migrationsTableName: 'migrations_history',
});
