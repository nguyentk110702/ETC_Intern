import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ShippingStatus } from '../../entities/entities/Order';
import { Type } from 'class-transformer';
import { OrderItems } from '../../entities/entities/OrderItems';

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  orderCode: string;
  
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

  @IsNotEmpty({ message: 'Shipping address is required' })
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

  @IsEnum(ShippingStatus)
  @IsOptional()
  shippingStatus?: ShippingStatus;

  @Type(() => OrderItems)
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  items: OrderItems[];
}
