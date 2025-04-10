import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './Order';
import { ProductVariant } from './ProductVariant';

@Index('variantId', ['variantId'], {})
@Entity('order_items', { schema: 'nguyentk' })
export class OrderItems {
  @Column('int', { primary: true, name: 'orderId' })
  orderId: number;

  @Column('int', { primary: true, name: 'variantId', nullable: false })
  variantId: number;

  @Column('int', { name: 'quantity' })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @ManyToOne(() => Order, (order) => order.orderItems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.orderItems,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'variantId', referencedColumnName: 'id' }])
  variant: ProductVariant;
}
