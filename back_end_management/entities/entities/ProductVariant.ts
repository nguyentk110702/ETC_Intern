import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItems } from './OrderItems';
import { ProductEntity } from '../../src/product/product.entity';
import { Color } from './Color';
import { Size } from './Size';
import { Material } from './Material';

@Index('barCode', ['barCode'], { unique: true })
@Index('colorId', ['colorId'], {})
@Index('materialId', ['materialId'], {})
@Index('productId', ['productId'], {})
@Index('sizeId', ['sizeId'], {})
@Index('skuCode', ['skuCode'], { unique: true })
@Entity('product_variant', { schema: 'nguyentk' })
export class ProductVariant {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at' })
  updatedAt: Date;

  @Column('tinyint', { name: 'isDelete', nullable: true, default: () => "'0'" })
  isDelete: number | null;

  @Column('varchar', {
    name: 'skuCode',
    nullable: true,
    unique: true,
    length: 255,
  })
  skuCode: string | null;

  @Column('varchar', {
    name: 'barCode',
    nullable: true,
    unique: true,
    length: 255,
  })
  barCode: string | null;

  @Column('varchar', { name: 'unit', nullable: true, length: 255 })
  unit: string | null;

  @Column('int', { name: 'sellPrice' })
  sellPrice: number;

  @Column('int', { name: 'comparePrice', nullable: true })
  comparePrice: number | null;

  @Column('int', { name: 'cost' })
  cost: number;

  @Column('int', { name: 'quantity', nullable: true, default: () => "'0'" })
  quantity: number | null;

  @Column('varchar', { name: 'image', nullable: true, length: 255 })
  image: string | null;

  @Column('int', { name: 'productId', nullable: true })
  productId: number | null;

  @Column('int', { name: 'colorId', nullable: true })
  colorId: number | null;

  @Column('int', { name: 'sizeId', nullable: true })
  sizeId: number | null;

  @Column('int', { name: 'materialId', nullable: true })
  materialId: number | null;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.variant)
  orderItems: OrderItems[];

  @ManyToOne(() => ProductEntity, (product) => product.productVariants, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: ProductEntity;

  @ManyToOne(() => Color, (color) => color.productVariants, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'colorId', referencedColumnName: 'id' }])
  color: Color;

  @ManyToOne(() => Size, (size) => size.productVariants, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'sizeId', referencedColumnName: 'id' }])
  size: Size;

  @ManyToOne(() => Material, (material) => material.productVariants, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'materialId', referencedColumnName: 'id' }])
  material: Material;
}
