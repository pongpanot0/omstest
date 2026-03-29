import { Component, OnInit } from '@angular/core';
import { TableColumn, TableAction } from '../shared/ui/table/table.model';
import { Router } from '@angular/router';
import { ApiService } from '../shared/service/apiservice';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  stocks: any[] = [];
  page = 1;
  limit = 10;
  total = 0;
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadProducts()
  }
  columns: TableColumn[] = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Qty' },
    { key: 'unit', label: 'Unit' },
    { key: 'status', label: 'Status', type: 'badge' } // เพิ่ม type badge เพื่อโชว์สี
  ];

  actions: TableAction[] = [
    {
      label: 'Adjust Stock',
      class: 'text-orange-600 hover:bg-orange-50 px-2 py-1 rounded',
      callback: (row) => this.openAdjustModal(row)
    },
    {
      label: 'History',
      class: 'text-slate-600 hover:bg-slate-50 px-2 py-1 rounded',
      callback: (row) => this.viewStockHistory(row)
    }
  ];


  openAdjustModal(data: any) {
    console.log({ data });

    this.router.navigate(['dashboard/inventory/adjust/' + data.productId])

  }
  viewStockHistory(data: any) {
    this.router.navigate(['dashboard/inventory/history/' + data.productId])
  }

  routerPage(data: string) {
    if (data == 'inventory') {
      this.router.navigate(['dashboard/inventory/create'])
    } else {
      this.router.navigate(['dashboard/product/create'])
    }



  }
  totalItems: any = ''
  pageSize: any = 10

  async loadProducts() {
    try {
      const res: any = await this.apiService.get(
        `products?page=${this.page}&limit=${this.limit}`
      );

      console.log('API:', res);

      // map data ให้เข้ากับ table
      this.stocks = res.data.data.map((item: any) => ({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        category: item.category,
        quantity: item.stock, // backend = stock → frontend = quantity
        unit: 'Unit', // ถ้ายังไม่มี field unit
        status: this.getStockStatus(item.stock),
      }));

      this.totalItems = res.data.meta.total;
      console.log(this.totalItems);

    } catch (error) {
      console.error('Load products error:', error);
    }
  }
  getStockStatus(stock: number): string {
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock <= 5) return 'LOW_STOCK';
    return 'IN_STOCK';
  }
  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadProducts();
  }
}
