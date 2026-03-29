import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { ApiService } from '../shared/service/apiservice';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss']
})
export class OrderCreateComponent implements OnInit {
  orderItems: any[] = [];
  shippingAddress = '123 Sukhumvit Road, Watthana, Bangkok 10110';

  constructor(private cartService: CartService, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    // ดึงข้อมูลสินค้าที่เลือกมาจากหน้า Catalog
    this.orderItems = this.cartService.items;
  }

  // คำนวณยอดรวมสินค้า (ก่อนภาษี)
  get subtotal(): number {
    return this.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // คำนวณภาษี 7%
  get vat(): number {
    return this.subtotal * 0.07;
  }

  // ยอดสุทธิ
  get grandTotal(): number {
    return this.subtotal + this.vat;
  }

  removeProduct(productId: string) {
    this.cartService.removeItem(productId);
    this.orderItems = this.cartService.items; // อัปเดต list ในหน้าจอ
  }

  async confirmOrder() {
    const payload = {
      items: this.orderItems,
      subtotal: this.subtotal,
      vat: this.vat,
      total: this.grandTotal,
      address: this.shippingAddress
    };

    const response: any = await this.apiService.post('orders', payload)
    this.cartService.clearCart();
    this.router.navigate(['/dashboard/success/' + response.data])
    /*  console.log('Sending Order to Server...', response.data.orderId); */
    // Logic: เรียก API แล้ว clear ตะกร้า

  }
  updateQuantity(item: any, newQty: number) {
    // 1. ป้องกันไม่ให้คีย์ค่าน้อยกว่า 1
    if (newQty < 1) {
      item.quantity = 1;
      return;
    }

    // 2. เช็คว่าห้ามเกินสต็อกที่มี (Stock Validation)
    if (newQty > item.stock) {
      alert(`ขออภัย! สินค้านี้มีสต็อกคงเหลือเพียง ${item.stock} ${item.unit || 'ชิ้น'}`);
      item.quantity = item.stock; // ปรับกลับเป็นค่าสูงสุดที่มี
      return;
    }

    // 3. อัปเดตค่าลงใน Service เพื่อให้ข้อมูล Sync กัน
    item.quantity = newQty;
    this.cartService.updateQuantity(item.id, newQty);
  }
}
