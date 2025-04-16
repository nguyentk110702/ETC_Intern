import { Injectable, NestMiddleware } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthEntity } from './auth.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const sessionUser = req.session?.userData;

    if (!sessionUser) {
      return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ' });
    }

    // 2. Lấy user từ DB
    const userRepo = this.dataSource.getRepository(AuthEntity);
    let user: AuthEntity | null = null;
    try {
      user = await userRepo.findOne({ where: { id: sessionUser.id } });
    } catch (error) {
      console.error('Lỗi khi truy vấn người dùng:', error);
      return res
        .status(500)
        .json({ message: 'Lỗi server khi xác thực tài khoản' });
    }

    // 3. Kiểm tra trạng thái tài khoản
    if (!user || user.status === 1) {
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Lỗi khi hủy session:', err);
        }
        res.clearCookie('connect.sid'); // clear cookie tên default
        return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
      });
    } else {
      req.session.userData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
      };
      next();
    }
  }
}
