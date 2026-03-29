import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/service/apiservice';

@Component({
  selector: 'app-ordertrack',
  templateUrl: './ordertrack.component.html',
  styleUrls: ['./ordertrack.component.scss']
})
export class OrdertrackComponent implements OnInit {
  orderId: string | null = '';
  orderData: any;
  orderItems: any[] = [];
  constructor(private route: ActivatedRoute, private ApiService: ApiService) { }

 async ngOnInit() {
    // ดึงเลข Order ID จาก URL เช่น /detail/ORD-99
    this.orderId = this.route.snapshot.paramMap.get('id');

    // เรียกใช้ API (ในที่นี้คือ Mockup)
  await  this.getData();

  }

  fetchOrderDetails(id: string | null) {
    // Logic: ยิง API ไปที่ NestJS เพื่อเอาข้อมูลออเดอร์นี้มาโชว์
    console.log('Fetching detail for:', id);
  }

  async getData() {
    try {
      const response = await this.ApiService.get<any>('orders/' + this.orderId);
      const item = response.data;

      if (item) {
        // 1. Map ข้อมูล Header และข้อมูลทั่วไป
        this.orderData = {
          id: `ORD-${String(item.orderId).padStart(3, '0')}`,
          customerName: item.customerName || item.user?.username || 'Pongpanot Samakkarn',
          status: item.status, // 'Pending', 'Processing', etc.
          total: item.totalAmount,
          createdAt: item.createdAt,
          address: item.shippingAddressName,
          // คำนวณ % สำหรับ Progress Bar
          progress: this.calculateProgress(item.status)
        };

        // 2. Map ข้อมูลรายการสินค้า (Order Items)
        // ต้องมั่นใจว่า Backend ส่ง item.items มา และข้างในมี item.product
        this.orderItems = item.items.map((i: any) => ({
          name: i.productName || 'Unknown Product',
          price: i.productPrice, // ใช้ unitPrice จากตาราง ORDER_ITEMS
          quantity: i.quantity,
          subtotal: i.productPrice * i.quantity
        }));

        console.log('Mapped Order Data:', this.orderData);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  }

  // ฟังก์ชันช่วยคำนวณ % Progress Bar
  calculateProgress(status: string): number {
    const steps: any = {
      'Pending': 0,
      'Processing': 33,
      'Shipped': 66,
      'Delivered': 100
    };
    return steps[status] || 0;
  }
}
