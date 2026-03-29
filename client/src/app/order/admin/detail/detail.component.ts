import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/service/apiservice';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  orderId: string | null = '';

  // สถานะทั้งหมดที่มีในระบบ
  orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // ข้อมูล Mockup
  orderData = {
    id: 'ORD-202603-99',
    customerName: 'Pongpanot Samakkarn',
    status: 'Pending',
    shippingAddressName: '',
    shippingFullAddress: '',
    userId: '1',
    items: [
      { name: 'Wagyu Beef A5', price: 4500, quantity: 2 },
      { name: 'Black Truffle Oil', price: 850, quantity: 1 }
    ],
    total: 9630
  };

  constructor(private route: ActivatedRoute, private ApiService: ApiService) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.getData()
  }
  async getData() {
    try {
      // สมมติว่า NestJS ส่งกลับมาในรูปแบบ { success: true, data: { ... } }
      const response = await this.ApiService.get<any>('orders/' + this.orderId);
      console.log('Raw Response:', response);

      const item = response.data;
      console.log(item);

      if (item) {
        // ✅ แมพเข้า orderData โดยตรง (ไม่ต้องใช้ .map())
        this.orderData = {
          id: `ORD-${String(item.orderId).padStart(3, '0')}`,
          // ใช้ username หรือ customerName ตามที่มีใน DB
          customerName: item.user?.username || 'Pongpanot Samakkarn',
          status: item.status, // หรือ item.status.toUpperCase()
          total: item.totalAmount,
          userId: item.userId,
          shippingAddressName: item.shippingAddressName,
          shippingFullAddress: item.shippingFullAddress,
          items: item.items.map((i: any) => ({
            productId:i.productId,
            name: i.productName || 'Unknown Product',
            price: i.productPrice,
            quantity: i.quantity
          })),


        };

        console.log('Mapped Order Data:', this.orderData);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  }
  // ฟังก์ชันเปลี่ยนสถานะ (เช่น กดส่งของ)
  async updateStatus(newStatus: string) {
    if (confirm(`ยืนยันการเปลี่ยนสถานะเป็น ${newStatus}?`)) {
      this.orderData.id
      this.orderData.status = newStatus;
      await this.ApiService.patch('orders/' + this.orderId, this.orderData)
      // ตรงนี้เรียก Service ยิง Patch ไปที่ NestJS
    }
  }

  // ฟังก์ชันยกเลิกออเดอร์
  async cancelOrder() {
    if (confirm('คุณแน่ใจใช่ไหมที่จะยกเลิกออเดอร์นี้? (สต็อกจะถูกคืนเข้าคลังอัตโนมัติ)')) {
      this.orderData.status = 'Cancelled';
      console.log('API Cancel Order');
      await this.ApiService.patch('orders/' + this.orderId, this.orderData)
    }
  }
}
