import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  Session,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService, userSessionType } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EditUserDto } from './dto/editUser.dto';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { AuthGuard } from './auth.guard';
import { EditEmployeeDto } from './dto/editEmployee.dto';
import { Roles } from '../common/decorators/roles.decorator';
import * as Redis from 'redis';
import { promisify } from 'util';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Session() session: Record<string, any>) {
    const user = await this.authService.login(
      { email: body.email, password: body.password, phone: body.phone },
      session,
    );
    session.user = user;
    console.log('Session sau khi đăng nhập:', session);
    return { message: 'Đăng nhập thành công', user };
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.authService.register(body);
  }

  @SetMetadata('roles', ['ADMIN', 'MANAGER'])
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post('employee')
  async createEmployee(
    @Body() body: CreateEmployeeDto,
    @Session() session: Record<string, userSessionType>,
  ) {
    return this.authService.createEmployee(body, session);
  }

  @UseGuards(AuthGuard)
  @Get('employee')
  async getAllEmployeeByIdManager(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('role') role: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('status') status: number,
    @Session() session: Record<string, userSessionType>,
  ) {
    return this.authService.getAllEmployeeByIdManager(
      search,
      page,
      limit,
      role,
      startDate,
      endDate,
      status,
      session,
    );
  }

  @Get('session')
  async getSession(@Session() session: Record<string, any>) {
    try {
      const sessionUser = session.user; // Kiểm tra lại biến session.user thay vì session.userData
      if (!sessionUser) {
        throw new HttpException('No active session', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.authService.findById(sessionUser.id); // Dùng service hoặc repository để tìm user trong DB

      if (!user) {
        session.destroy(() => {}); // Xóa session nếu không tìm thấy user
        throw new HttpException(
          'Tài khoản không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }

      if (user.status === 1) {
        // Kiểm tra trạng thái tài khoản
        session.destroy(() => {}); // Xóa session nếu tài khoản bị khóa
        throw new HttpException(
          'Tài khoản của bạn đã bị khóa',
          HttpStatus.FORBIDDEN,
        ); // Trả về lỗi 403
      }

      return { user: sessionUser };
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  async logout(@Session() session: Record<string, any>, @Res() res: Response) {
    try {
      session.destroy((err) => {
        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi đăng xuất!',
          });
        }
        res.status(HttpStatus.OK).json({ message: 'Đăng xuất thành công!' });
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra!',
      });
    }
  }

  @Get('clearSession')
  async clearSession(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    try {
      session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ message: 'Failed to clear session' });
        }

        res.clearCookie('SESSION_TWICE', { path: '/' });
        return res
          .status(200)
          .json({ message: 'Session cleared successfully' });
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'An error occurred' });
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async editUser(@Param('id') id: number, @Body() body: EditUserDto) {
    return this.authService.editUser(id, body);
  }

  @UseGuards(AuthGuard)
  @Put('employee/:id')
  async editEmployee(
    @Param('id') id: number,
    @Body() body: EditEmployeeDto,
    @Session() session: Record<string, userSessionType>,
  ) {
    return this.authService.editEmployee(id, body, session);
  }

  @UseGuards(AuthGuard)
  @Get('employee/:id')
  async getEmployeeDetail(
    @Param('id') id: number,
    @Session() session: Record<string, userSessionType>,
  ) {
    return this.authService.getEmployeeDetail(id, session);
  }

  @Get('set-session')
  setSession(@Req() req: Request) {
    req.session['test'] = 'hello-redis';
    return { message: 'Session set!' };
  }

  @Get('get-session')
  getSessionTest(@Req() req: Request) {
    return {
      message: 'Session read',
      value: req.session['test'] || 'Session not found',
    };
  }

  @UseGuards(AuthGuard)
  @Get('admin/active-users')
  @Roles('ADMIN')
  async getActiveUsers(@Session() session: Record<string, any>) {
    if (!session.user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return new Promise((resolve, reject) => {
      const redisClient = Redis.createClient({
        host: '127.0.0.1',
        port: 6379,
      });

      redisClient.keys('sess:*', (err, keys) => {
        if (err) {
          console.error('Lỗi khi lấy keys từ Redis:', err);
          return reject(
            new HttpException('Lỗi Redis', HttpStatus.INTERNAL_SERVER_ERROR),
          );
        }

        if (!keys.length) {
          return resolve({ count: 0, activeUsers: [] });
        }

        redisClient.mget(keys, (err, sessions) => {
          if (err) {
            console.error('Lỗi khi lấy session từ Redis:', err);
            return reject(
              new HttpException('Lỗi Redis', HttpStatus.INTERNAL_SERVER_ERROR),
            );
          }

          const activeUsers = sessions
            .map((sessionStr) => {
              try {
                const sessionData = JSON.parse(sessionStr);
                const user = sessionData?.user;
                if (!user) return null;

                return user.data ? user.data : user;
              } catch {
                return null;
              }
            })
            .filter((user) => user !== null && user.role?.name !== 'ADMIN');

          return resolve({
            count: activeUsers.length,
            activeUsers,
          });
        });
      });
    });
  }

  @Post('admin/logout-user/:id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  async logoutUser(@Param('id') id: number): Promise<any> {
    const redisClient = Redis.createClient({
      host: '127.0.0.1',
      port: 6379,
    });

    // Dùng promisify để dùng async/await
    const smembersAsync = promisify(redisClient.smembers).bind(redisClient);
    const delAsync = promisify(redisClient.del).bind(redisClient);
    const sremAsync = promisify(redisClient.srem).bind(redisClient);

    const userSessionKey = `user_sessions:${id}`;

    try {
      // Lấy tất cả sessionRedisKey trong Set
      const sessionRedisKeys: string[] = await smembersAsync(userSessionKey);

      if (!sessionRedisKeys || sessionRedisKeys.length === 0) {
        return { message: 'Không có session nào để xoá cho user này' };
      }

      // Xoá các session Redis
      const deletedCount = await delAsync(...sessionRedisKeys);

      // Xoá session keys khỏi tập hợp user_sessions
      await sremAsync(userSessionKey, ...sessionRedisKeys);

      return {
        message: `✅ Đã đăng xuất ${deletedCount} session cho user ${id}`,
      };
    } catch (error) {
      console.error('❌ Redis error:', error);
      throw new HttpException('Redis error', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      redisClient.quit();
    }
  }
}
