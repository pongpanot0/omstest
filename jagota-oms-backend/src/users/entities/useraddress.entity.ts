/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('USER_ADDRESSES')
export class UserAddress {
  @PrimaryGeneratedColumn({ name: 'ADDRESS_ID' })
  addressId: number;

  @Column({ name: 'ADDRESS_NAME', length: 50, nullable: true })
  addressName: string;

  @Column({ name: 'RECEIVER_NAME', length: 100 })
  receiverName: string;

  @Column({ name: 'PHONE_NUMBER', length: 20 })
  phoneNumber: string;

  @Column({ name: 'ADDRESS_DETAIL', type: 'clob' })
  addressDetail: string;

  @Column({ name: 'PROVINCE', length: 50, nullable: true })
  province: string;

  @Column({ name: 'POSTAL_CODE', length: 10, nullable: true })
  postalCode: string;

  @Column({ name: 'IS_DEFAULT', default: 0 })
  isDefault: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'USER_ID' })
  user: User;
}
