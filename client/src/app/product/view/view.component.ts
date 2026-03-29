import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/service/apiservice';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  products: any
  filteredProducts: any
  searchTerm: string = '';
  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    try {
      // ยิงไปที่ GET /products
      const data:any = await this.apiService.get('products');
      console.log(data.data.meta);

      this.products = data.data.data;
      console.log(this.products);

      this.filteredProducts =  data.data.data;
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.loading = false;
    }
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter((p: { NAME: string; SKU: string; CATEGORY: string; }) =>
      p.NAME.toLowerCase().includes(term) ||
      p.SKU.toLowerCase().includes(term) ||
      p.CATEGORY?.toLowerCase().includes(term)
    );
  }

  goToCreate() {
    this.router.navigate(['/dashboard/product/create']);
  }

  // ตัวอย่างฟังก์ชัน Format ตัวเลข (Currency)
  formatPrice(price: number) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(price);
  }
}
