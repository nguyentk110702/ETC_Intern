import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude, Transform, TransformFnParams } from 'class-transformer';
import { RoleEntity } from '../role/role.entity';
import { CommonEntity } from '../common/entity/common.entity';

export enum UserStatus {
  WORKING,
  RESIGNED,
}

@Entity({ name: 'user' })
export class AuthEntity extends CommonEntity {
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
    type: 'tinyint',
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
      toPlainOnly: true, //biến đổi khi chuyển từ class sang object ,    ,,instanceToPlain
      toClassOnly: false, // biến đổi từ object sang class ,, plainToInstance
    },
  )
  status: number;

  @Column({ default: false })
  something: boolean;
}
