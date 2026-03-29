import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from './entities/product.entity';

@Module({
   imports:[TypeOrmModule.forFeature([Order, OrderItem, Product]),],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
