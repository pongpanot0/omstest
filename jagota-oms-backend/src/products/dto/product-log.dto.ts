import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductLogAction } from '../entities/product-log.entity';

export class CreateProductLogDto {
  @IsNumber()
  productId: number;

  @IsEnum(ProductLogAction)
  action: ProductLogAction;

  @IsOptional()
  @IsString()
  oldValue?: string;

  @IsOptional()
  @IsString()
  newValue?: string;

  @IsOptional()
  @IsString()
  changedBy?: string;
}