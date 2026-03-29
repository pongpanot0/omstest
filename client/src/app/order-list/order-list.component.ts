import { ApiService } from './../shared/service/apiservice';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { TableColumn, TableAction } from '../shared/ui/table/table.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  username: string = ''
  role: string = ''
  myTotalOrders: string = '1'
  myPendingOrders: string = '2'
  myShippedOrders: string = '3'
  columns: TableColumn[] = [
    { key: 'id', label: 'Order ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'total', label: 'Total Amount', type: 'currency' },
    { key: 'status', label: 'Status' }
  ];

  actions: TableAction[] = [

    {
      label: 'View Detail',
      callback: (row: any) => this.viewDetail(row)
    }
  ];

  // ข้อมูลจำลอง (Mock Data)
  orders = [
    { id: 'ORD-001', customerName: 'Khun Bank', total: 1500, status: 'PENDING' },
    { id: 'ORD-002', customerName: 'Staff', total: 4500, status: 'DELIVERED' }
  ];
  ordersCustomer = []
  constructor(private authService: AuthService, private router: Router, private cartService: CartService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.getData()
    this.username = this.authService.currentUserValue?.username ?? ''
    this.role = this.authService.currentUserValue?.role ?? ''
  }
  openUpdateStatusModal(data: any) {

  }
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  async getData() {

    try {
      const response = await this.ApiService.get<any>(`orders?page=${this.currentPage}&limit=${this.pageSize}`)
      console.log({ response });
      this.orders = response.data.data.map((item: any) => ({
        // แปลง ID เป็น Format ORD-XXX (เติม 0 ข้างหน้าให้ดูสวย)
        id: item.orderId,

        // ถ้า Backend ไม่มี customerName ให้ใช้ username จาก nested user แทน
        customerName: item.user?.username || 'Unknown Customer',

        total: item.totalAmount,

        // ปรับ Status เป็นตัวพิมพ์ใหญ่ตามที่ตัวอย่างคุณต้องการ
        status: item.status.toUpperCase(),

        // นับจำนวนชิ้นในออเดอร์นั้นๆ
        itemsCount: item.items.length
      }));

      this.ordersCustomer = response.data.data.map((item: any) => ({
        // แปลง ID เป็น Format ORD-XXX (เติม 0 ข้างหน้าให้ดูสวย)
        id: item.orderId,

        // ถ้า Backend ไม่มี customerName ให้ใช้ username จาก nested user แทน
        customerName: item.user?.username || 'Unknown Customer',

        total: item.totalAmount,

        // ปรับ Status เป็นตัวพิมพ์ใหญ่ตามที่ตัวอย่างคุณต้องการ
        status: item.status.toUpperCase(),

        // นับจำนวนชิ้นในออเดอร์นั้นๆ
        itemsCount: item.items.length,
        date: item.createdAt
      }));
      this.totalItems = response.data.total
    } catch (error) {

    }


  }
  viewDetail(data: any) {
    this.router.navigate(['/dashboard/orders/admin/detail/' + data.id]);

  }

  columnsCustomer: TableColumn[] = [
    { key: 'id', label: 'Order #' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'total', label: 'Total', type: 'currency' },
    { key: 'status', label: 'Status' }
  ];

  actionsCustomer: TableAction[] = [
    {
      label: 'Detail',
      // ปรับให้เป็น Outline Button สีฟ้า ดูเด่นแต่ไม่หนักเกินไป
      class: 'px-3 py-1.5 text-orange-600 font-bold border border-orange-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-xs flex items-center justify-center',
      callback: (row) => this.detailOrder(row),

    },
    {
      label: 'Track',
      // ปรับให้เป็น Outline Button สีฟ้า ดูเด่นแต่ไม่หนักเกินไป
      class: 'px-3 py-1.5 text-blue-600 font-bold border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-xs flex items-center justify-center',
      callback: (row) => this.trackOrder(row),
      showIf: (row) => row.status !== 'Cancelled'
    },

  ];

  trackOrder(data: any) {
    this.router.navigate(['dashboard/customer/track', data.id]);
  }

  detailOrder(data: any) {
    this.router.navigate(['/dashboard/customer/detail/' + data.id]);

  }
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.getData();
  }
}
