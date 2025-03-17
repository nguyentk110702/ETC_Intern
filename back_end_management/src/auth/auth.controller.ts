import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Req() req: Request) {
    try {
      const { email, password } = body;

      if (!email || !password) {
        return { message: 'Email và mật khẩu là bắt buộc' };
      }

      const user = await this.authService.findUserByEmail(email);
      if (!user) {
        return { message: 'Người dùng không tồn tại' };
      }

      const isMatch = await this.authService.comparePassword(
        password,
        user.password,
      );
      if (!isMatch) {
        return { message: 'Sai mật khẩu' };
      }

      req.session.user = { id: user.id.toString(), email: user.email };
      console.log('Session sau khi login:', req.session);

      return { message: 'Đăng nhập thành công', user };
    } catch (error) {
      console.log(error);
    }
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(
      body.fullname,
      body.email,
      body.password,
      body.repassword,
    );
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (!req.session.user) {
      return res.status(400).json({ message: 'Chưa đăng nhập' });
    }

    (req.session as any).destroy((err: any) => {
      if (err) {
        console.error('Lỗi khi logout:', err);
        return res.status(500).json({ message: 'Lỗi khi đăng xuất' });
      }
      return res.status(200).json({ message: 'Đăng xuất thành công' });
    });
  }
}
