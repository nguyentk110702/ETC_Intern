import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(['0', '1', '2'])
  orderStatus: '0' | '1' | '2';

  @IsOptional()
  @IsNumber()
  paymentMethodId?: number;
  @IsEnum(['0', '1'])
  payment: '0' | '1';
  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  deliveryCost?: number;

  @IsOptional()
  @IsNumber()
  tax?: number;
}
