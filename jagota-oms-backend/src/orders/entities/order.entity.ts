import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('ORDERS')
@Check(`STATUS IN ('Pending','Processing','Shipped','Delivered','Cancelled')`)
export class Order {
  @PrimaryGeneratedColumn({ name: 'ORDER_ID' })
  orderId: number;

  @Column({ name: 'TOTAL_AMOUNT', type: 'number', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ name: 'VAT_AMOUNT', type: 'number', precision: 12, scale: 2 })
  vatAmount: number;

  @Column({ name: 'STATUS', default: 'Pending', length: 20 })
  status: string;

  @Column({ name: 'SHIPPING_ADDRESS_NAME', length: 50, nullable: true })
  shippingAddressName: string;

  @Column({ name: 'SHIPPING_FULL_ADDRESS', type: 'clob' })
  shippingFullAddress: string;

  @Column({ name: 'TAX_IDENTIFICATION_NUMBER', length: 20, nullable: true })
  taxIdentificationNumber: string;

  @Column({ name: 'USER_ID' })
  user_id: number;



  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
