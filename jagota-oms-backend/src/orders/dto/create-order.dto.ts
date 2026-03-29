import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemInput {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  vatAmount: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  shippingAddressName?: string;

  @IsString()
  @IsNotEmpty()
  shippingFullAddress: string;

  @IsOptional()
  @IsString()
  taxIdentificationNumber?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];
}