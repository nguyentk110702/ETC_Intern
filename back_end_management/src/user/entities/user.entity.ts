import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity('users')
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

  @Column({ type: 'tinyint', default: 1 }) // 1: Active, 0: Inactive
  status: number;

  @Column({ type: 'tinyint', default: 0 }) // Xóa mềm (0: Chưa xóa, 1: Đã xóa)
  isDelete: number;

  @ManyToOne(() => Role, (role) => role.users, { eager: true }) // Liên kết với Role
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'int', nullable: true })
  managerId: number;
}
