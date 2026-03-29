import { ApiService } from './../../shared/service/apiservice';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  orderId: string | null = '';
  // สมมติข้อมูลที่ดึงมาจาก API (หรือ Mockup)
  orderItems: any[] = [
    { id: 'P001', name: 'Wagyu Beef A5', price: 4500, quantity: 2, sku: 'WGY-001', stock: 10 },
    { id: 'P002', name: 'Black Truffle Oil', price: 850, quantity: 1, sku: 'TRF-025', stock: 5 }
  ];
  orderHeader: any = []
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private ApiService: ApiService
  ) { }

  ngOnInit() {

    this.orderId = this.route.snapshot.paramMap.get('id');
    console.log(this.orderId);

    this.getData()
  }
  async getData() {
    try {
      const response = await this.ApiService.get<any>('orders/' + this.orderId);
      const item = response.data; // สมมติว่า response.data คือ Object ที่คุณแนบมาข้างบน

      console.log('Order Detail:', item);

      // กรณีต้องการแสดงรายการสินค้าที่อยู่ใน Order นี้ (items ภายใน)
      if (item && item.items) {
        this.orderItems = item.items.map((prod: any) => ({
          id: prod.productId,
          name: prod.productName || 'N/A',
          price: prod.productPrice,
          quantity: prod.quantity,



        }));
      }

      // เก็บข้อมูล Header ของ Order ไว้โชว์ที่หน้าจอ
      this.orderHeader = {
        displayId: `ORD-${String(item.orderId).padStart(3, '0')}`,
        customerName: item.customerName || item.user?.username || 'Unknown Customer',

        status: item.status?.toUpperCase() || 'PENDING',
        address: item.shippingFullAddress,
        itemCount: item.items?.length || 0,
        totalAmount: item.totalAmount
      };

    } catch (error) {
      console.error('Load Order Detail Error:', error);
    }
  }

  reorder() {
    if (confirm(`ต้องการเพิ่มสินค้าจากออเดอร์ ${this.orderHeader.displayId} ลงในตะกร้าอีกครั้งใช่หรือไม่?`)) {
      // ตัวอย่างการเรียก Service (งานจริงต้องดึง items จาก API ก่อน)
      const itemsToCart = this.orderItems.map((item: any) => ({ ...item }));
      this.cartService.loadItems(itemsToCart);
      alert('เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว');
      this.router.navigate(['/dashboard/orders/create']);
    }
  }
}
