import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(private dataSource: DataSource,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) { }
  async create(createOrderDto: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. สร้างก้อน Order
      const order = queryRunner.manager.create(Order, {
        customerName: createOrderDto.customerName ?? 'พงศ์ปณต สมัครการ',
        shippingAddressName: createOrderDto.address,
        shippingFullAddress: createOrderDto.address,
        status: 'Pending',
        totalAmount: createOrderDto.total,
        vatAmount: createOrderDto.vat,
        user_id: 1,

      });


      // 2. บันทึก Order และ Items (Cascade)
      const savedOrder = await queryRunner.manager.save(order);

      const orderId = savedOrder.orderId
      console.log({ savedOrder });
      console.log(createOrderDto.items);
      const itemRows = createOrderDto.items.map(item => ({
        order_id: orderId,
        product_id: item.id, // หรือ productId ตามที่แมพมา
        quantity: item.quantity,
        unitPrice: item.price
      }));

      await queryRunner.manager.insert(OrderItem, itemRows);

      // 3. ตัดสต็อกสินค้า (Business Logic)
      for (const item of createOrderDto.items) {
        const product = await queryRunner.manager.findOne(Product, { where: { productId: item.productId } });

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(`สินค้า ${item.name} หมดสต็อก`);
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      await queryRunner.commitTransaction();
      return orderId;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }



  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    username?: string,
  ) {
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .select([
        'order.orderId',
        'order.status',
        'order.totalAmount',
        'order.createdAt',

        'user.userId',
        'user.username',

        'item.itemId',
        'item.quantity',


        'product.productId',
        'product.name',
        'product.price',
        'product.stock',
      ]);

    // 🔍 filter
    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    if (username) {
      qb.andWhere('LOWER(user.username) LIKE LOWER(:username)', {
        username: `%${username}%`,
      });
    }

    // 📄 pagination
    qb.skip((page - 1) * limit).take(limit);

    // 🔽 order
    qb.orderBy('order.createdAt', 'DESC');

    const [result, total] = await qb.getManyAndCount();

    return {
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    // ใช้ getRawMany เพื่อให้ได้ข้อมูลแบบ Flat (แบนราบ) 
    // ถ้า Order 1 อันมี 3 Items มันจะคืนออกมาเป็น Array 3 Objects ที่หน้าตาเหมือนกันแต่ต่างกันที่ข้อมูลสินค้า
    const rawData = await this.orderRepository.createQueryBuilder('o')
      .leftJoin('o.user', 'u')
      .leftJoin('o.items', 'i')
      .leftJoin('i.product', 'p') // ใช้ 'p' เป็น alias สั้นๆ ลดความสับสน
      .select([
        'o.ORDER_ID AS "orderId"',
        'o.STATUS AS "status"',
        'o.TOTAL_AMOUNT AS "totalAmount"',
        'u.USERNAME AS "customerName"',
        'u.userId AS "userId"',
        'o.shippingAddressName AS "shippingAddressName"',
        'o.shippingFullAddress AS "shippingFullAddress"',
        'p.productId AS "productId"',
        'p.NAME AS "productName"',
        'p.PRICE AS "productPrice"',
        'i.QUANTITY AS "quantity"'
      ])
      .where('o.ORDER_ID = :id', { id })
      .getRawMany();

    if (rawData.length === 0) return null;

    // จัดกลุ่ม (Group) ให้กลายเป็น 1 Order ที่มี items อยู่ข้างในแบบแบนๆ
    return {
      orderId: rawData[0].orderId,
      status: rawData[0].status,
      totalAmount: rawData[0].totalAmount,
      customerName: rawData[0].customerName,
      userId: rawData[0].userId,
      shippingAddressName: rawData[0].shippingAddressName,
      shippingFullAddress: rawData[0].shippingFullAddress,
      items: rawData.map(row => ({
        productId: row.productId,
        productName: row.productName,
        productPrice: row.productPrice,
        quantity: row.quantity
      }))
    };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. ดึงข้อมูล Order เฉพาะรายการสินค้ามาดูว่าต้องคืนอะไรบ้าง
      const order = await queryRunner.manager.findOne(Order, {
        where: { orderId: id },
        relations: ['items', 'items.product'],
      });

      if (!order) throw new Error('Order not found');



      if (updateOrderDto.status === 'CANCELLED') {
        for (const item of order.items) {
          await queryRunner.manager
            .createQueryBuilder()
            .update(Product)
            .set({
              // ใช้ "STOCK" (ตัวพิมพ์ใหญ่ตาม DB) และบวกค่าตรงๆ
              stock: () => `STOCK + ${item.quantity}`
            })
            .where("PRODUCT_ID = :id", { id: item.product.productId })
            .execute();
        }
      }
      // 3. อัปเดตสถานะออเดอร์ในตารางหลัก
      await queryRunner.manager.update(Order, id, { status: updateOrderDto.status });

      await queryRunner.commitTransaction();
      return { success: true, message: `Order Updated` };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { success: false, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
