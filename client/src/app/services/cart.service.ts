// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // เก็บรายการสินค้าในตะกร้า
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() { }

  // ดึงข้อมูลสินค้าปัจจุบันในตะกร้า
  get items() {
    return this.cartItems.value;
  }

  // เพิ่มสินค้าลงตะกร้า
  addItem(product: any) {
    const currentItems = [...this.items];
    const index = currentItems.findIndex(item => item.id === product.id);

    if (index > -1) {
      // เช็คก่อนเพิ่มว่าเกินสต็อกไหม
      const newQty = currentItems[index].quantity + 1;
      if (newQty <= currentItems[index].stock) {
        currentItems[index].quantity = newQty;
      } else {
        alert('ขออภัย สินค้าในสต็อกไม่พอ');
      }
    } else {
      // เพิ่มชิ้นแรก (ต้องมั่นใจว่า product มี field stock ติดมาด้วย)
      currentItems.push({ ...product, quantity: 1 });
    }
    this.cartItems.next(currentItems);
  }

  // ลบสินค้า
  removeItem(productId: string) {
    const updatedItems = this.items.filter(item => item.id !== productId);
    this.cartItems.next(updatedItems);
  }

  // คำนวณราคารวมทั้งหมด
  getGrandTotal(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // นับจำนวนชิ้นทั้งหมดในตะกร้า
  getTotalCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // ล้างตะกร้า (ใช้หลังสั่งซื้อเสร็จ)
  clearCart() {
    this.cartItems.next([]);
  }
  updateQuantity(productId: string, newQty: number) {
    const currentItems = [...this.items];
    const item = currentItems.find(i => i.id === productId);

    if (item) {
      // Validation: ต้องไม่น้อยกว่า 1 และไม่เกิน stock
      if (newQty >= 1 && newQty <= item.stock) {
        item.quantity = Number(newQty);
        this.cartItems.next(currentItems);
      }
    }
  }
  loadItems(products: any[]) {
    // ล้างตะกร้าเก่าก่อน หรือจะใช้การรวม (Merge) ก็ได้
    // แต่ปกติ Reorder มักจะแทนที่ตะกร้าปัจจุบัน
    this.cartItems.next([...products]);
  }
}
