import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/service/apiservice';

@Component({
  selector: 'app-inventoryhistory',
  templateUrl: './inventoryhistory.component.html',
  styleUrls: ['./inventoryhistory.component.scss']
})
export class InventoryhistoryComponent implements OnInit {
  productId: string | null = null;
  productName = 'Wagyu Beef A5'; // ปกติดึงจาก Service
  currentStock : any = ''
  // Mock Data: ประวัติการเคลื่อนไหว
  movements = [
    {
      date: new Date('2026-03-28T14:30:00'),
      type: 'ADJUST_SUBTRACT',
      reason: 'Damaged',
      amount: -2,
      balance: 48,
      user: 'Pongpanot',
      note: 'ขวดน้ำมันรั่วขณะจัดเรียง'
    },
    {
      date: new Date('2026-03-25T09:00:00'),
      type: 'SALE',
      reason: 'Order #ORD-9921',
      amount: -5,
      balance: 50,
      user: 'System',
      note: ''
    },
    {
      date: new Date('2026-03-20T11:15:00'),
      type: 'STOCK_IN',
      reason: 'PO-2026-005',
      amount: 55,
      balance: 55,
      user: 'Admin_Jagota',
      note: 'รับสินค้าเข้าจาก Supplier'
    }
  ];

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProductData(this.productId ?? '1')
  }
  async loadProductData(id: string) {
    try {
      const product: any = await this.apiService.get(`products/history/${id}`);
      console.log({product});

      // สำคัญ: Oracle บางทีส่งตัวเลขมาในรูปแบบ String "50"
      // เราต้องจัดการให้เป็น Number ก่อนใช้งาน
      if (product) {

         this.currentStock = product.data.product.currentStock;
        this.productName = product.data.product.name;
        this.productId = product.data.product.id;
        this.movements = product.data.movements;
      }
    } catch (error) {
      console.error('Failed to load product', error);

    }
  }

  // Helper สำหรับเลือกสี Badge
  getStatusClass(type: string) {
    switch (type) {
      case 'STOCK_IN': return 'bg-green-100 text-green-700';
      case 'SALE': return 'bg-blue-100 text-blue-700';
      case 'ADJUST_SUBTRACT': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}
