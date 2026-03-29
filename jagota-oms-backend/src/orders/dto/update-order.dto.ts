import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}