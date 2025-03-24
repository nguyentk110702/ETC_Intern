import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserStatus } from '../auth.entity';

export class EditEmployeeDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(6, 20)
  phone: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  // @Length(6, 20)
  fullname: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  // @Length(6, 20)
  address: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  role: number;

  @IsOptional()
  status: UserStatus;
}
