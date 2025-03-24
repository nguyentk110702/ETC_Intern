import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
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

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Session() session: Record<string, any>) {
    return await this.authService.login(
      { email: body.email, password: body.password, phone: body.phone },
      session,
    );
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.authService.register(body);
  }

  @SetMetadata('roles', ['ADMIN', 'MANAGER'])
  @UseGuards(AuthGuard)
  @Post('employee')
  createEmployee(
    @Body() body: CreateEmployeeDto,
    @Session() session: Record<string, userSessionType>,
  ) {
    return this.authService.createEmployee(body, session);
  }

  @UseGuards(AuthGuard)
  @Get('employee')
  getAllEmployeeByIdManager(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('role') role: string,
    @Query('createAt') createAt: string,
    @Query('status') status: number,
    @Session() session: Record<string, userSessionType>,
  ) {
    return this.authService.getAllEmployeeByIdManager(
      search,
      page,
      limit,
      role,
      createAt,
      status,
      session,
    );
  }

  @Get('session')
  getSession(@Session() session: Record<string, any>, @Res() res: Response) {
    try {
      const sessionUser = session.userData;
      if (sessionUser) {
        res.json(sessionUser);
      } else {
        res.status(401).json({ message: 'No active session' });
      }
    } catch {
      console.log('error');
    }
  }

  @Get('logout')
  clearSession(
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
  editUser(@Param('id') id: number, @Body() body: EditUserDto) {
    return this.authService.editUser(id, body);
  }

  @SetMetadata('roles', ['MANAGER', 'ADMIN'])
  @UseGuards(AuthGuard)
  @Put('employee/:id')
  editEmployee(
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
}
