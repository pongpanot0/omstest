import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('PRODUCTS')
export class Product {
  [x: string]: any;
  @PrimaryGeneratedColumn({ name: 'PRODUCT_ID' })
  productId: number;

  @Column({ name: 'SKU', length: 50, unique: true })
  sku: string;

  @Column({ name: 'NAME', length: 200 })
  name: string;

  @Column({ name: 'PRICE', type: 'number', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'STOCK', default: 0 })
  stock: number;

  @Column({ name: 'UNIT', default: 0 })
  unit: string;



  @Column({ name: 'CATEGORY', length: 50, nullable: true })
  category: string;



}
