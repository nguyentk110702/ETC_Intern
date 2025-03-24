import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Color } from '../../entities/entities/Color';
import { Material } from '../../entities/entities/Material';
import { ProductVariant } from '../../entities/entities/ProductVariant';
import { Size } from '../../entities/entities/Size';
import { AuthEntity } from '../auth/auth.entity';

@Index('barCode', ['barCode'], { unique: true })
@Index('createById', ['createById'], {})
@Index('skuCode', ['skuCode'], { unique: true })
@Entity('product', { schema: 'nguyentk' })
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column('tinyint', { name: 'isDelete', nullable: true, default: () => "'0'" })
  isDelete: number | null;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

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

  @Column('varchar', { name: 'branch', nullable: true, length: 255 })
  branch: string | null;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  @Column('int', { name: 'sellPrice' })
  sellPrice: number;

  @Column('int', { name: 'comparePrice', nullable: true })
  comparePrice: number | null;

  @Column('int', { name: 'cost', default: 0 })
  cost: number;

  @Column('varchar', { name: 'image', nullable: true, length: 255 })
  image: string | null;

  @Column('int', { name: 'quantity', nullable: true, default: () => "'0'" })
  quantity: number | null;

  @Column('int', { name: 'createById', nullable: true })
  createById: number | null;

  @OneToMany(() => Color, (color) => color.product)
  colors: Color[];

  @OneToMany(() => Material, (material) => material.product)
  materials: Material[];

  @ManyToOne(() => AuthEntity, (user) => user.id, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'createById', referencedColumnName: 'id' }])
  createBy: AuthEntity;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product, {
    cascade: ['remove'],
  })
  productVariants: ProductVariant[];

  @OneToMany(() => Size, (size) => size.product)
  sizes: Size[];
}
