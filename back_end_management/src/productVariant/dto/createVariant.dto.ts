import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVarianDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idProduct: number;

  @IsNotEmpty()
  @IsString()
  skuCode: string;

  @IsNotEmpty()
  @IsString()
  barCode: string;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  sellPrice: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  comparePrice: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsString()
  // @IsOptional()
  material: string;

  @IsOptional()
  @IsString()
  image?: string;
}
