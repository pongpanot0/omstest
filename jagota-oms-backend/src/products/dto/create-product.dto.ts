import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  category?: string;

  // จำนวนสินค้าที่รับเข้า (ก้อนแรก)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  // เชื่อมกับ Purchase Order (PO)
  @IsOptional()
  @IsString() // หรือ IsNumber() ตามความจริงใน Oracle
  poId?: string;

  // วันหมดอายุ (สำคัญมากสำหรับสินค้า Jagota)
  // ใช้ IsDateString เพื่อรับค่า ISO 8601 จาก Angular (เช่น '2026-12-31')
  @IsNotEmpty()
  @IsDateString()
  expiryDate: string; 

  @IsOptional()
  @IsString()
  brand?: string;
}

export class StockReceiveItemDto {
  productId: number;
  quantity: number;
  expiryDate: string;
  lotNumber:string
}

export class CreateStockReceiveDto {
  poNumber: string;
  supplier: string;
  receiveDate: string;
  items: StockReceiveItemDto[]; // รับเป็น Array ตาม Form ของคุณ
}