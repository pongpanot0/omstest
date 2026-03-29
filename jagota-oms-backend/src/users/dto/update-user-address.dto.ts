import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAddressDto } from './useraddress.dto';

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {}
