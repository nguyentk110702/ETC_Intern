import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  orderCode: string;

  @IsInt()
  price: number;

  @IsOptional()
  @IsInt()
  discount?: number;

  @IsOptional()
  @IsInt()
  deliveryCost?: number;

  @IsEnum(['0', '1'])
  payment: '0' | '1';

  @IsEnum(['0', '1', '2'])
  orderStatus: '0' | '1' | '2';

  @IsOptional()
  @IsInt()
  tax?: number;

  @IsOptional()
  @IsInt()
  paymentMethodId?: number;

  @IsNotEmpty()
  @IsString()
  addressShipping: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  customer?: string;

  @IsInt()
  createById: number;
}
