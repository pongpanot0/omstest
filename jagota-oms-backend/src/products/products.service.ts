import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, CreateStockReceiveDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductBatch } from './entities/productBatch.entity';
import { ProductLog, ProductLogAction } from './entities/product-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/shared/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(private dataSource: DataSource,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,


  ) { }
  async create(dto: CreateProductDto) {
    // 1. ตรวจสอบว่า SKU นี้มีในระบบหรือยัง
    const existingProduct = await this.productRepository.findOne({
      where: { sku: dto.sku.toUpperCase() }
    });

    if (existingProduct) {
      throw new ConflictException(`Product with SKU ${dto.sku} already exists.`);
    }

    console.log(dto);
    
    // 2. สร้างข้อมูลใหม่
    const newProduct = this.productRepository.create({
      ...dto,
      sku: dto.sku.toUpperCase(), // บังคับเป็นตัวพิมพ์ใหญ่เพื่อความเป็นระเบียบ
      stock: 0 // สินค้าใหม่ต้องเริ่มที่ 0
    });

    // 3. บันทึกลง Oracle
    return await this.productRepository.save(newProduct);
  }

  async receiveStock(dto: CreateStockReceiveDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of dto.items) {
        // 1. ค้นหา Product เพื่อเอาข้อมูลมาทำ Log (และเช็คว่ามีตัวตนไหม)
        const product = await queryRunner.manager.findOne(Product, {
          where: { productId: item.productId }
        });

        if (!product) throw new Error(`Product ID ${item.productId} not found`);

        // 2. อัปเดตยอด STOCK รวมในตาราง PRODUCTS
        await queryRunner.manager.update(Product, item.productId, {
          stock: () => `STOCK + ${item.quantity}`
        });

        console.log({ item, dto });


        await queryRunner.manager.insert(ProductBatch, {
          productId: Number(item.productId),
          poId: String(dto.poNumber),
          expiryDate: new Date(item.expiryDate),
          RECEIVE_QTY: Number(item.quantity),
          remainingQty: Number(item.quantity),

        });

        await queryRunner.manager.insert(ProductLog, {
          productId: Number(item.productId),
          action: ProductLogAction.RECEIVE, // ต้องแก้ constraint ก่อนนะ
          newValue: JSON.stringify({
            po: dto.poNumber,
            addedQty: Number(item.quantity),
            expiry: item.expiryDate,
          }),
          changedBy: userId,
        });
      }

      await queryRunner.commitTransaction();
      return { success: true, message: `Received ${dto.items.length} items successfully` };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, id } = query;
    const qb = this.productRepository.createQueryBuilder('p')
      .select([
        'p.productId',
        'p.sku',
        'p.name',
        'p.price',
        'p.stock',
        'p.category',
        'p.unit'
      ]);

    // filter by id (optional)
    if (id) {
      qb.andWhere('p.productId = :id', { id });
    }

    // pagination
    qb.skip((page - 1) * limit).take(limit);

    // order (สำคัญมาก)
    qb.orderBy('p.productId', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };

  }

  async findOne(id: number) {
    const qb = this.productRepository.createQueryBuilder('p')
      .select([
        'p.productId',
        'p.sku',
        'p.name',
        'p.price',
        'p.stock',
        'p.category',
          'p.unit'
      ]);
    qb.where('p.productId = :id', { id });
    qb.orderBy('p.productId', 'DESC');

    const data = await qb.getOne();
    return data
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  // products.service.ts
  async adjustStock(dto: any, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isAdd = dto.type.toUpperCase() === 'ADD';
      const amount = Number(dto.amount);
      const changeQty = isAdd ? amount : -amount;

      // 1. บันทึกประวัติใน PRODUCT_LOGS
      const newValue = Number(dto.currentQty) + changeQty;
      await queryRunner.manager.insert(ProductLog, {
        productId: dto.productId,

        action: ProductLogAction.ADJUST,
        oldValue: dto.currentQty.toString(),
        newValue: newValue.toString(),
        reason: `[Batch: ${dto.batchId || 'N/A'}] ${dto.reason} : ${dto.note || ''}`,
        changedBy: userId ?? "1",
        changedAt: new Date()
      });

      // 2. อัปเดตยอดรวมในตาราง PRODUCTS
      await queryRunner.manager
        .createQueryBuilder()
        .update(Product)
        .set({ stock: () => `STOCK + ${changeQty}` })
        .where("PRODUCT_ID = :id", { id: dto.productId })
        .execute();

      // 3. อัปเดตยอดในตาราง PRODUCT_BATCHES (เฉพาะเจาะจงราย Batch)
      if (dto.batchId) {
        await queryRunner.manager
          .createQueryBuilder()
          .update('PRODUCT_BATCHES') // ใส่ชื่อคอลัมน์ให้ตรงกับ Oracle
          .set({
            REMAINING_QTY: () => `REMAINING_QTY + ${changeQty}`
          })
          .where("BATCH_ID = :batchId AND PRODUCT_ID = :productId", {
            batchId: dto.batchId,
            productId: dto.productId
          })
          .execute();
      }

      await queryRunner.commitTransaction();
      return { success: true };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Adjust Batch Error:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneWithHistory(productId: number) {
    const product = await this.productRepository.findOne({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 1. ดึง Logs (ใช้ QueryBuilder เพื่อความเร็วและจัดการ Alias ให้ตรง)
    const logs = await this.dataSource
      .createQueryBuilder()
      .select([
        'l.LOG_ID as "logId"',
        'l.ACTION as "action"',
        'l.OLD_VALUE as "oldValue"',
        'l.NEW_VALUE as "newValue"',
        'l.CHANGED_BY as "changedBy"',
        'l.CHANGED_AT as "changedAt"',
        'l.REASON as "reason"',
      ])
      .from(ProductLog, 'l')
      .where('l.PRODUCT_ID = :productId', { productId })
      .orderBy('l.CHANGED_AT', 'DESC')
      .getRawMany();

    // 2. ดึงยอดคงเหลือปัจจุบันจาก Batches (หรือจาก PRODUCTS.STOCK โดยตรงก็ได้)
    const batches = await this.dataSource
      .createQueryBuilder()
      .select('SUM(b.REMAINING_QTY)', 'total')
      .from('PRODUCT_BATCHES', 'b')
      .where('b.PRODUCT_ID = :productId', { productId })
      .getRawOne();

    const currentBalance = Number(batches.total || 0);
    let runningBalance = currentBalance;

    // ฟังก์ชันช่วย Parse กรณีข้อมูลใน DB ไม่เป็น JSON (เช่น เป็น String ธรรมดา)
    const safeParseValue = (val: any) => {
      if (typeof val !== 'string') return val;
      try {
        return JSON.parse(val);
      } catch {
        return val; // ถ้าไม่ใช่ JSON ให้คืนค่า String เดิม
      }
    };

    const movements = logs.map((log) => {
      const newValue = safeParseValue(log.newValue);
      const oldValue = safeParseValue(log.oldValue);

      let amount = 0;

      // --- Logic คำนวณส่วนต่าง (Amount) ตามประเภท Action ---
      switch (log.action) {
        case 'RECEIVE': {
          // ถ้าเก็บเป็น JSON { addedQty: 10 } หรือเก็บเป็นเลขตรงๆ
          amount = Number(newValue.addedQty || newValue || 0);
          break;
        }

        case 'SALE': {
          // คำนวณจาก New - Old (จะได้ค่าติดลบ เช่น 45 - 50 = -5)
          amount = Number(newValue) - Number(oldValue);
          break;
        }

        case 'ADJUST': {
          const n = typeof newValue === 'object' ? (newValue.newQty || newValue) : newValue;
          const o = typeof oldValue === 'object' ? (oldValue.oldQty || oldValue) : oldValue;
          // ✅ แก้ไข: Assign ค่าเข้าตัวแปรภายนอก ไม่ต้องประกาศ const ซ้ำ และห้าม return ที่นี่
          amount = Number(n) - Number(o);
          break;
        }

        default: {
          // เคสทั่วไป: ผลต่างระหว่างค่าใหม่กับค่าเก่า
          amount = Number(newValue || 0) - Number(oldValue || 0);
          break;
        }
      }

      // คำนวณยอดคงเหลือย้อนกลับ (Reverse Running Balance)
      const balanceAtThatTime = runningBalance;
      runningBalance -= amount;

      // ✅ ทุก Case จะต้องมาจบที่การ return Object นี้เสมอ
      return {
        date: log.changedAt,
        type: log.action,
        amount: amount,
        balance: balanceAtThatTime,
        user: log.changedBy === '1' ? 'System/Admin' : log.changedBy,
        note: newValue?.po || newValue?.reason || log.reason || '-',
        reason: log.reason,
      };
    });

    return {
      product: {
        id: product.productId,
        name: product.name,
        sku: product.sku,
        currentStock: product.stock,
      },
      movements,
    };
  }
}
