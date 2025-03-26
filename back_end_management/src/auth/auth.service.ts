import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EditUserDto } from './dto/editUser.dto';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { EditEmployeeDto } from './dto/editEmployee.dto';
import { RoleEntity } from '../role/role.entity';

export interface userSessionType {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async login(
    data: LoginDto,
    session: Record<string, userSessionType>,
  ): Promise<{ message: string; data: AuthEntity }> {
    console.log('data', data);
    if (!data.email && !data.phone)
      throw new HttpException(
        'Email or phone is required',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.authRepository.findOne({
      where: {
        email: data.email,
        phone: data.phone,
        isDelete: false,
      },
      relations: ['role'],
    });

    if (!user) {
      throw new HttpException(
        'Username not found or password is incorrect',
        HttpStatus.NOT_FOUND,
      );
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (isMatch == true) {
      session.userData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
      };
      return {
        message: 'Login successfully',
        data: user,
      };
    } else {
      throw new HttpException(
        'Username not found or password is incorrect',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async register(
    data: CreateUserDto,
  ): Promise<{ message: string; data: AuthEntity }> {
    try {
      const findUser = await this.authRepository.findOne({
        where: {
          email: data.email,
          isDelete: false,
        },
      });
      if (findUser) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const slatRound = 10;
      const hash = await bcrypt.hash(data.password, slatRound);
      const role = await this.roleRepository.findOne({
        where: { name: 'STAFF' },
      });
      console.log('role', role);
      console.log(await this.roleRepository.query('SELECT DATABASE();'));

      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      const user = this.authRepository.create({
        email: data.email,
        password: hash,
        fullName: data.fullname,
        role: role,
      });
      const savedUser = await this.authRepository.save(user);

      return {
        message: 'User created successfully',
        data: savedUser,
      };
    } catch (error) {
      if (error.status !== 500) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createEmployee(
    body: CreateEmployeeDto,
    session: Record<string, userSessionType>,
  ) {
    const idUser = session.userData;
    if (!idUser || (idUser.role !== 'MANAGER' && idUser.role !== 'ADMIN'))
      throw new ForbiddenException('you are not manager');
    const role = await this.roleRepository.findOne({
      where: { id: body.id_role },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (role.name === 'ADMIN') {
      throw new ForbiddenException('Cannot create another ADMIN');
    }
    if (idUser.role === 'MANAGER' && role.name === 'MANAGER') {
      throw new ForbiddenException('MANAGER cannot create another MANAGER');
    }

    const slatRound = 10;
    const hash = await bcrypt.hash(body.password, slatRound);
    const user = this.authRepository.create({
      password: hash,
      fullName: body.fullname,
      phone: body.phone,
      address: body.address,
      role: role,
      managerId: idUser.id,
      status: body.status,
    });
    await this.authRepository.save(user);
    return {
      message: 'Employee created successfully',
      user,
    };
  }

  async getAllEmployeeByIdManager(
    search?: string,
    page: number = 1,
    limit: number = 10,
    roleQuery?: string,
    createAt?: string,
    status?: number,
    session?: Record<string, userSessionType>,
  ) {
    try {
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const idUser = session?.userData?.id;
      if (!idUser) throw new UnauthorizedException('User session is missing');

      const user = await this.authRepository.findOne({
        where: { id: idUser },
        relations: ['role'],
      });

      if (!user) throw new NotFoundException('User not found');

      const isAdmin = user.role?.name === 'ADMIN';
      const isManager = user.role?.name === 'MANAGER';
      const isStaff = user.role?.name === 'STAFF';

      if (isStaff) {
        const staffInfo = await this.authRepository.findOne({
          where: { id: user.id },
          relations: ['role'],
        });

        return {
          listEmployee: staffInfo ? [staffInfo] : [],
          page,
          limit,
        };
      }
      if (!isAdmin && !isManager) {
        throw new ForbiddenException(
          'You do not have permission to view employees',
        );
      }

      const whereConditions: FindOptionsWhere<AuthEntity> = {};

      if (!isAdmin) {
        whereConditions.managerId = user.managerId || user.id;
      } // ADMIN sẽ không có điều kiện này, lấy toàn bộ nhân viên

      if (search) {
        whereConditions.email = Like(`%${search}%`);
        whereConditions.phone = Like(`%${search}%`);
        whereConditions.fullName = Like(`%${search}%`);
      }

      // Lọc theo vai trò (role)
      if (roleQuery) {
        const findRole = await this.roleRepository.findOne({
          where: { name: roleQuery },
        });
        if (!findRole) throw new NotFoundException('Role not found');
        whereConditions.role = findRole;
      }
      if (status !== undefined && [0, 1].includes(status)) {
        whereConditions.status = status;
      }

      // Lọc theo ngày tạo
      if (createAt) {
        const startDate = new Date(createAt);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(createAt);
        endDate.setHours(23, 59, 59, 999);
        whereConditions.created_at = Between(startDate, endDate);
      }
      let listEmployee = await this.authRepository.find({
        where: whereConditions,
        skip: (page - 1) * limit,
        take: limit,
        relations: ['role'],
        withDeleted: false,
        order: { created_at: 'DESC' },
      });

      if (!isAdmin && !isManager) {
        listEmployee = listEmployee.filter(
          (employee) => employee.id !== user.id,
        );
      }

      return {
        listEmployee,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error in getAllEmployeeByIdManager:', error);

      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof ForbiddenException) throw error;

      throw new InternalServerErrorException(
        'An error occurred while fetching employees',
      );
    }
  }

  async editEmployee(
    id: number,
    body: EditEmployeeDto,
    session: Record<string, userSessionType>,
  ) {
    try {
      const idUser = session?.userData?.id;
      if (!idUser) throw new UnauthorizedException('User session is missing');

      const user = await this.authRepository.findOne({
        where: { id: idUser },
        relations: ['role'],
      });

      if (!user) throw new NotFoundException('User not found');

      const findEmployee = await this.authRepository.findOne({
        where: { id: id },
        relations: ['role'],
      });

      if (!findEmployee) throw new NotFoundException('Employee not found');

      const isAdmin = user.role?.name === 'ADMIN';
      const isManager = user.role?.name === 'MANAGER';
      const isStaff = user.role?.name === 'STAFF';

      if (isStaff && findEmployee.id !== user.id) {
        throw new ForbiddenException('You can only edit your own profile');
      }
      if (isManager && findEmployee.managerId !== user.id) {
        throw new ForbiddenException(
          'You do not have permission to edit this employee',
        );
      }

      if (body.role) {
        const findRole = await this.roleRepository.findOne({
          where: { id: body.role },
        });
        if (!findRole) throw new NotFoundException('Role not found');
        findEmployee.role = findRole;
      }

      findEmployee.email = body.email;
      findEmployee.phone = body.phone;
      findEmployee.status = body.status; // 0 hoặc 1
      findEmployee.address = body.address;
      findEmployee.fullName = body.fullname;
      findEmployee.updated_at = new Date();

      return await this.authRepository.save(findEmployee);
    } catch (error) {
      console.error('Error in editEmployee:', error);

      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof ForbiddenException) throw error;

      throw new InternalServerErrorException(
        'An error occurred while updating employee',
      );
    }
  }

  async editUser(id: number, data: EditUserDto) {
    const updatedUser = await this.authRepository.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    updatedUser.updated_at = new Date();
    await this.authRepository.save(updatedUser);
    return { message: 'Edit user successfully', data: updatedUser };
  }

  async getEmployeeDetail(
    id: number,
    session: Record<string, userSessionType>,
  ) {
    try {
      const idUser = session?.userData?.id;
      if (!idUser) throw new UnauthorizedException('User session is missing');

      const user = await this.authRepository.findOne({
        where: { id: idUser },
        relations: ['role'],
      });

      if (!user) throw new NotFoundException('User not found');

      const isManager = user.role?.name === 'MANAGER';
      const isStaff = user.role?.name === 'STAFF';

      const employee = await this.authRepository.findOne({
        where: { id: id },
        relations: ['role'],
      });

      if (!employee) throw new NotFoundException('Employee not found');

      if (isStaff && employee.id !== user.id) {
        throw new ForbiddenException('You can only view your own profile');
      }

      if (isManager && employee.managerId !== user.id) {
        throw new ForbiddenException(
          'You do not have permission to view this employee',
        );
      }

      return employee;
    } catch (error) {
      console.error('Error in getEmployeeDetail:', error);

      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof ForbiddenException) throw error;

      throw new InternalServerErrorException(
        'An error occurred while fetching employee details',
      );
    }
  }
}
