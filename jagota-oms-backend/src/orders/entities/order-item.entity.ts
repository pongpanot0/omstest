import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('ORDER_ITEMS')
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'ITEM_ID' })
  itemId: number;

  @Column({ name: 'QUANTITY' })
  quantity: number;

  @Column({ name: 'UNIT_PRICE', type: 'number', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'ORDER_ID' })
  order_id
    @Column({ name: 'PRODUCT_ID' })
product_id

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ORDER_ID' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'PRODUCT_ID' })
  product: Product;
}
