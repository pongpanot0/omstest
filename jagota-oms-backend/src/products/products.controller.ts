import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, CreateStockReceiveDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/shared/pagination-query.dto';
import { ReturnDocument } from 'typeorm';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  @Post('adjust')
  adjustStock(@Body() createProductDto: CreateProductDto) {
    return this.productsService.adjustStock(createProductDto, "1");
  }



  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    try {
      const response = await this.productsService.findAll(query);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return error
    }

  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {
      const response = await this.productsService.findOne(+id);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return error
    }

  }
  @Get('/history/:id')
  async findOneWithHistory(@Param('id') id: string) {

    try {
      const response = await this.productsService.findOneWithHistory(+id);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return error
    }

  }


  @Patch('/recive-stock')
  update(@Body() CreateStockReceiveDto: CreateStockReceiveDto) {
    return this.productsService.receiveStock(CreateStockReceiveDto, '1');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
