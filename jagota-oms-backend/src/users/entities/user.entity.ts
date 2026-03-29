import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Check,
} from 'typeorm';

import { UserAddress } from './useraddress.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('USERS')
@Check(`ROLE IN ('Admin','Customer','Staff')`)
export class User {
  @PrimaryGeneratedColumn({ name: 'USER_ID' })
  userId: number;

  @Column({ name: 'USERNAME', length: 50, unique: true })
  username: string;

  @Column({ name: 'PASSWORD', length: 255 })
  password: string;

  @Column({ name: 'FULL_NAME', length: 100 })
  fullName: string;

  @Column({ name: 'EMAIL', length: 100, unique: true })
  email: string;

  @Column({ name: 'ROLE', length: 20, default: 'Customer' })
  role: string;

  @Column({ name: 'TAX_ID', length: 20, nullable: true })
  taxId: string;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => UserAddress, (addr) => addr.user)
  addresses: UserAddress[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];
}
