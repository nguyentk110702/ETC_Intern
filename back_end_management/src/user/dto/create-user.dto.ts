import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsOptional()
  @IsString()
  something: string;
  @IsNotEmpty()
  @IsString()
  roleId: string;
}
