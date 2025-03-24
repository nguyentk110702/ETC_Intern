import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../../src/product/product.entity';
import { ProductVariant } from './ProductVariant';

@Index('productId', ['productId'], {})
@Entity('material', { schema: 'nguyentk' })
export class Material {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('int', { name: 'productId', nullable: true })
  productId: number | null;

  @ManyToOne(() => ProductEntity, (product) => product.materials, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: ProductEntity;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.material)
  productVariants: ProductVariant[];
}
