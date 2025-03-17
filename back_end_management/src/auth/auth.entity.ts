import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude, Transform, TransformFnParams } from 'class-transformer';
import { RoleEntity } from 'src/role/entities/role.entity';
import { UserStatus } from '../user/entities/user.entity';

@Entity('auth')
export class AuthEntity {
  @Column({ nullable: true })
  managerId: number;

  @Column({ nullable: true, unique: true, length: 50 })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: null,
    nullable: true,
  })
  @Transform(
    ({ value }: TransformFnParams) => {
      if (value === null) return null;
      return `${UserStatus[value]?.toLowerCase()}`;
    },
    {
      toPlainOnly: true,
      toClassOnly: false,
    },
  )
  status: number;

  @Column({ default: false })
  something: boolean;
}
