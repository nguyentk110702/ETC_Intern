import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log('Dữ liệu nhận được:', createUserDto);
      const user = this.userRepository.create(createUserDto);
      console.log('Đã tạo entity:', user);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Lỗi khi tạo user:', error);
      throw new Error('Lỗi server khi tạo user');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = Object.assign(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  getUserByFilter(filters: any) {
    const query = this.userRepository.createQueryBuilder('user');

    if (filters.name) {
      query.andWhere('user.name LIKE :name', { name: `%${filters.name}%` });
    }
    if (filters.phone) {
      query.andWhere('user.phone LIKE :phone', { phone: `%${filters.phone}%` });
    }
    if (filters.email) {
      query.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
    }
    if (filters.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }
    if (filters.status) {
      query.andWhere('user.status = :status', { status: filters.status });
    }
    if (filters.createdAt) {
      query.andWhere('DATE(user.createdAt) = :createdAt', {
        createdAt: filters.createdAt,
      });
    }

    return query.getMany();
  }
}
