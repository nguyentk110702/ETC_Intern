import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // Thay bằng username database của bạn
      password: 'abcd1234', // Thay bằng password database của bạn
      database: 'management_system', // Thay bằng tên database
      autoLoadEntities: true, // Tự động load các entity
      synchronize: true, // Chỉ dùng trong development (Tự động cập nhật schema)
    }),
    UserModule,
    RoleModule,
  ],
})
export class AppModule {}
