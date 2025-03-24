import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './Order';
import { ProductEntity } from '../../src/product/product.entity';
import { Role } from './Role';

@Index('IDX_8e1f623798118e629b46a9e629', ['phone'], { unique: true })
@Index('IDX_e12875dfb3b1d92d7d7c5377e2', ['email'], { unique: true })
@Entity('user', { schema: 'nguyentk' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('tinyint', { name: 'isDelete', default: () => "'0'" })
  isDelete: number;

  @Column('int', { name: 'managerId', nullable: true })
  managerId: number | null;

  @Column('varchar', {
    name: 'email',
    nullable: true,
    unique: true,
    length: 50,
  })
  email: string | null;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('varchar', { name: 'fullName', length: 255 })
  fullName: string;

  @Column('varchar', {
    name: 'phone',
    nullable: true,
    unique: true,
    length: 255,
  })
  phone: string | null;

  @Column('varchar', { name: 'address', nullable: true, length: 255 })
  address: string | null;

  @Column('tinyint', { name: 'status', nullable: true })
  status: number | null;

  @Column('tinyint', { name: 'something', default: () => "'0'" })
  something: number;

  @OneToMany(() => Order, (order) => order.createBy)
  orders: Order[];

  @OneToMany(() => ProductEntity, (product) => product.createBy)
  products: ProductEntity[];

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role;
}
