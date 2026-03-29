import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/service/apiservice';
@Component({
  selector: 'app-inventoryadjust',
  templateUrl: './inventoryadjust.component.html',
  styleUrls: ['./inventoryadjust.component.scss']
})
export class InventoryadjustComponent implements OnInit {
  adjustForm: FormGroup;
  productId: string | null = null;
  productName = 'Wagyu Beef A5'; // ปกติต้องดึงจาก Service โดยใช้ ID
  currentQty:number = 0; // ยอดปัจจุบันในระบบ

  reasons = [
    { value: 'DAMAGED', label: 'สินค้าชำรุด (Damaged)' },
    { value: 'EXPIRED', label: 'สินค้าหมดอายุ (Expired)' },
    { value: 'LOST', label: 'สินค้าสูญหาย (Inventory Lost)' },
    { value: 'CORRECTION', label: 'ปรับปรุงยอดให้ตรงกับหน้างาน (Correction)' },
    { value: 'RETURN', label: 'รับคืนจากลูกค้า (Customer Return)' }
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
    private apiService: ApiService
  ) {
    this.adjustForm = this.fb.group({
      type: ['SUBTRACT', Validators.required], // ADD หรือ SUBTRACT
      amount: [0, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductData(this.productId);
    }
  }
  get newTotal(): number {
    const type = this.adjustForm.get('type')?.value;
    const amount = this.adjustForm.get('amount')?.value || 0;
    console.log({ type, amount });

    return type === 'ADD' ? this.currentQty + amount : this.currentQty - amount;
  }
  async loadProductData(id: string) {
    try {
      const product: any = await this.apiService.get(`products/${id}`);

      // สำคัญ: Oracle บางทีส่งตัวเลขมาในรูปแบบ String "50"
      // เราต้องจัดการให้เป็น Number ก่อนใช้งาน
      if (product) {
        this.productName = product.data.name || 'Unknown Product';
        this.currentQty = Number(product.data.stock) || 0;


      }
    } catch (error) {
      console.error('Failed to load product', error);
      this.currentQty = 0;
    }
  }
  async onSubmit() {
    if (this.adjustForm.valid && this.newTotal >= 0) {
      const payload = {
        productId: Number(this.productId),
        type: this.adjustForm.value.type,
        amount: Number(this.adjustForm.value.amount),
        reason: this.adjustForm.value.reason,
        note: this.adjustForm.value.note,
        currentQty: this.currentQty // ส่งยอดเก่าไปให้ Backend เช็ค Double-check
      };

      try {
        await this.apiService.post('products/adjust', payload);
        alert('ปรับปรุงสต็อกสำเร็จ');
          this.router.navigate(['/dashboard/inventory']);
      } catch (error) {
        console.error('Adjustment error', error);
        alert('เกิดข้อผิดพลาดในการปรับปรุงสต็อก');
      }
    }
  }
}
