import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from 'src/shared/pagination-query.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {

      const orders = await this.ordersService.create(createOrderDto);
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลออเดอร์ได้',

        error: error.message
      };
    }
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    try {
      const orders = await this.ordersService.findAll(query.page,
        query.limit);
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลออเดอร์ได้',

        error: error.message
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const response = await this.ordersService.findOne(id);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลออเดอร์ได้',

        error: error.message
      };
    }

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      const response = await this.ordersService.update(+id, updateOrderDto);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: 'ไม่สามารถดึงข้อมูลออเดอร์ได้',

        error: error.message
      };
    }

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
