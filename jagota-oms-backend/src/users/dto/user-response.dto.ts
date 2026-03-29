import { Exclude } from 'class-transformer';

export class UserResponseDto {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  taxId?: string;
  createdAt: Date;

  @Exclude()
  password: string;
}
