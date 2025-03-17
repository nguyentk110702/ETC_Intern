import { User } from '../entities/user.entity';

export class UserDto {
  fullName: string;
  phone: string;
  email: string;
  status: string;
  roleName: string | null;
  createdAt: Date;
  address: string;

  constructor(user: User) {
    this.fullName = user.fullName;
    this.phone = user.phone;
    this.email = user.email;
    this.status = user.status;
    this.roleName = user.role?.name || null;
    this.createdAt = user.createdAt;
    this.address = user.address;
  }
}
