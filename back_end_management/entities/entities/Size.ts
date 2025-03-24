import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from './ProductVariant';
import { ProductEntity } from '../../src/product/product.entity';

@Index('productId', ['productId'], {})
@Entity('size', { schema: 'nguyentk' })
export class Size {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('int', { name: 'productId', nullable: true })
  productId: number | null;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.size)
  productVariants: ProductVariant[];

  @ManyToOne(() => ProductEntity, (product) => product.sizes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: ProductEntity;
}
