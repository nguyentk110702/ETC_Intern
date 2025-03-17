import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from '../../role/entities/role.entity';

export enum UserStatus {
  WORKING = '1',
  INACTIVE = '0',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.WORKING })
  status: UserStatus;

  @Column({ type: 'tinyint', default: 0 })
  isDelete: number;

  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
  @Column({ type: 'datetime', nullable: true })
  createdAt: Date;
  @Column({ type: 'int', nullable: true })
  managerId: number;
}
