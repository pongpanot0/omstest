import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ApiService } from 'src/app/shared/service/apiservice';

@Component({
  selector: 'app-ordercategory',
  templateUrl: './ordercategory.component.html',
  styleUrls: ['./ordercategory.component.scss']
})
export class OrdercategoryComponent implements OnInit {
  products:any = [];
  cart: any[] = [];
  filteredProducts: any = [];
  searchTerm: string = '';
  selectedCategory: string = 'All Items';
async  ngOnInit(): Promise<void> {

  await  this.loadProducts()
   await this.applyFilter();
  }
  constructor(private cartService: CartService, private router: Router, private apiService: ApiService) { }

  async loadProducts() {
    try {
      const res: any = await this.apiService.get(
        `products?page=1&limit=100`
      );
      // map data ให้เข้ากับ table
      this.products = res.data.data.map((item: any) => ({
        id: item.productId,
        sku: item.sku,
        name: item.name,
        category: item.category,
        stock: item.stock,
        price:item.price,
        unit: 'unit', // ถ้ายังไม่มี field unit
        image:'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }));

      console.log(this.products);

    } catch (error) {
      console.error('Load products error:', error);
    }
  }

  addToCart(product: any) {
    this.cartService.addItem(product);
    // เพิ่มเอฟเฟกต์เล็กน้อยให้ User รู้ว่าของเข้าตะกร้าแล้ว
  }

  get cartCount() {
    return this.cartService.getTotalCount();
  }

  get cartTotal() {
    return this.cartService.getGrandTotal();
  }

  goToCreateOrder() {
    this.router.navigate(['/dashboard/orders/create']);
  }
 applyFilter() {
  // สร้างตัวแปร search ไว้ข้างนอกเพื่อลดภาระ CPU (ไม่ต้องยิง toLowerCase() ทุกรอบใน loop)
  const term = (this.searchTerm || '').toLowerCase().trim();

  this.filteredProducts = this.products.filter((p: any) => {
    // 1. เช็ค Category
    // ใช้ .trim() ป้องกันกรณีใน DB มีช่องว่างติดมา
    const matchCategory =
      this.selectedCategory === 'All Items' ||
      (p.category && p.category.trim() === this.selectedCategory.trim());

    // 2. เช็ค Search (ดักกรณี name หรือ sku เป็น null/undefined ด้วย)
    const matchSearch =
      (p.name?.toLowerCase().includes(term)) ||
      (p.sku?.toLowerCase().includes(term));

    return matchCategory && matchSearch;
  });

  console.log('Filtered Results:', this.filteredProducts);
}
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilter();
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilter();
  }
}
