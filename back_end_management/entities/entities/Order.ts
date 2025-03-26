import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from './PaymentMethod';
import { OrderItems } from './OrderItems';
import { AuthEntity } from '../../src/auth/auth.entity';

export enum ShippingStatus {
  PENDING = 'PENDING', // Giao hàng sau
  SHIPPED = 'SHIPPED', // Đẩy qua hãng vận chuyển
  DELIVERED = 'DELIVERED', // Đã giao hàng
}

@Index('createById', ['createById'], {})
@Index('orderCode', ['orderCode'], { unique: true })
@Index('paymentMethodId', ['paymentMethodId'], {})
@Entity('order', { schema: 'nguyentk' })
export class Order {
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
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('tinyint', { name: 'isDelete', nullable: true, default: () => "'0'" })
  isDelete: number | null;

  @Column('varchar', { name: 'orderCode', unique: true, length: 255 })
  orderCode: string;

  @Column({ type: 'bigint', default: 0 })
  price: number;

  @Column('int', { name: 'discount', nullable: true, default: () => "'0'" })
  discount: number | null;

  @Column('int', { name: 'deliveryCost', nullable: true, default: () => "'0'" })
  deliveryCost: number | null;

  @Column('enum', {
    name: 'payment',
    comment: '0: Chưa thanh toán, 1: Đã thanh toán',
    enum: ['0', '1'],
  })
  payment: '0' | '1';

  @Column('enum', {
    name: 'orderStatus',
    comment: '0: Chờ xử lý, 1: Đang giao, 2: Hoàn tất',
    enum: ['0', '1', '2'],
  })
  orderStatus: '0' | '1' | '2';

  @Column('int', { name: 'tax', nullable: true, default: () => "'0'" })
  tax: number | null;
  @Column({ type: 'decimal', default: 0 })
  totalPrice: number;
  @Column('int', { name: 'paymentMethodId', nullable: true })
  paymentMethodId: number | null;

  @Column('varchar', {
    default: 'Default Address',
    name: 'address_shipping',
    length: 255,
  })
  addressShipping: string;

  @Column('varchar', { name: 'area', nullable: true, length: 255 })
  area: string | null;

  @Column('varchar', { name: 'customer', nullable: true, length: 255 })
  customer: string | null;

  @Column('int', { name: 'createById', nullable: true })
  createById: number | null;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.orders, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'paymentMethodId', referencedColumnName: 'id' }])
  paymentMethod: PaymentMethod;

  @ManyToOne(() => AuthEntity, (user) => user.id, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @ManyToOne(() => AuthEntity, (user) => user.id)
  createBy: AuthEntity;

  @OneToMany(() => OrderItems, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItems[];
  @Column('enum', {
    name: 'shippingStatus',
    comment:
      'PENDING: Giao hàng sau, SHIPPED: Đẩy qua hãng vận chuyển, DELIVERED: Đã giao hàng',
    enum: ShippingStatus,
    default: ShippingStatus.PENDING, // Mặc định là "Giao hàng sau"
  })
  shippingStatus: ShippingStatus;
}
