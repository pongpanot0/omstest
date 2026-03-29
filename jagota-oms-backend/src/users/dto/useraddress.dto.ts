import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUserAddressDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  addressName?: string;

  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  addressDetail: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  isDefault?: number;
}
