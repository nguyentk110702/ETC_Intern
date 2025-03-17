import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(
    fullname: string,
    email: string,
    password: string,
    repassword: string,
  ) {
    if (password !== repassword) {
      throw new Error('Mật khẩu nhập lại không khớp');
    }

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser !== null) {
      throw new Error('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      fullName: fullname,
      email,
      password: hashedPassword,
    });

    return { message: 'Đăng ký thành công', user };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    console.log('🔹 Password:', password);
    console.log('🔹 Hash từ DB:', hash);

    const isMatch = await bcrypt.compare(password, hash);
    console.log('🔹 Kết quả so sánh:', isMatch);

    return isMatch;
  }

  async findUserByEmail(email: string) {
    const users = await this.userService.findAll(); // Gọi DB
    console.log('Danh sách user lấy từ DB:', users); // Debug
    return users.find((user) => user.email === email) ?? null;
  }
}
