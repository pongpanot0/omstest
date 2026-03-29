import { IsEmail, IsOptional, IsString, Length, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsString()
  @Length(6, 255)
  password: string;

  @IsString()
  @Length(1, 100)
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['Admin', 'Customer', 'Staff'])
  role?: string;

  @IsOptional()
  @IsString()
  taxId?: string;
}
