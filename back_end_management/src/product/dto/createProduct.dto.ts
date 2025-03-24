import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  skuCode: string;

  @IsOptional()
  @IsString()
  barCode?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  sellPrice: number;

  @IsOptional()
  @IsNumber()
  comparePrice?: number; // Giá so sánh có thể không bắt buộc

  @IsOptional()
  @IsNumber()
  cost?: number; // Giá vốn có thể không bắt buộc

  @IsOptional()
  @IsString()
  image?: string; // URL ảnh sản phẩm

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
