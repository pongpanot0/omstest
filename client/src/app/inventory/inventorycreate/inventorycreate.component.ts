import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/service/apiservice';
@Component({
  selector: 'app-inventorycreate',
  templateUrl: './inventorycreate.component.html',
  styleUrls: ['./inventorycreate.component.scss']
})
export class InventorycreateComponent implements OnInit {
  stockForm: FormGroup;

  // Mock Data สำหรับเลือกสินค้า
  products = [
    { id: '1', name: 'Wagyu Beef Ribeye MB5+', sku: 'JGT-WAG-01', unit: 'Kg' },
    { id: '2', name: 'Truffle Oil Black 250ml', sku: 'JGT-TRF-02', unit: 'Bottle' },
    { id: '3', name: 'Hokkaido Milk 1L', sku: 'JGT-MILK-03', unit: 'Box' }
  ];
  page: number = 1
  limit: number = 100
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private ApiService: ApiService
  ) {
    // สร้างโครงสร้าง Form หลัก
    this.stockForm = this.fb.group({
      poNumber: ['', Validators.required],
      supplier: ['', Validators.required],
      receiveDate: [new Date().toISOString().substring(0, 10), Validators.required],
      items: this.fb.array([]),

    });
  }
  async ngOnInit(): Promise<void> {
    // เริ่มต้นให้มี 1 แถวรอไว้เลย
    await this.addItem();
    await this.loadProducts()
  }

  async loadProducts() {
    try {
      const res: any = await this.ApiService.get(
        `products?page=${this.page}&limit=${this.limit}`
      );

      console.log('API:', res);

      // map data ให้เข้ากับ table
      this.products = res.data.data.map((item: any) => ({
        id: item.productId,
        sku: item.sku,
        name: item.name,
        category: item.category,
        quantity: item.stock, // backend = stock → frontend = quantity
        unit: 'Unit', // ถ้ายังไม่มี field unit

      }));



    } catch (error) {
      console.error('Load products error:', error);
    }
  }
  futureDateValidator = (control: any) => {
    if (!control.value) return null; // ถ้ายังไม่ได้กรอก ไม่ต้อง check ให้ผ่านไปก่อน
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { pastDate: true };
  }

  // Getter สำหรับดึง FormArray ออกมาใช้ใน HTML
  get items(): FormArray {
    return this.stockForm.get('items') as FormArray;
  }

  // ฟังก์ชันสร้าง FormGroup สำหรับ 1 แถวสินค้า
  createItemRow(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      sku: [{ value: '', disabled: true }],
      quantity: [1, [Validators.required, Validators.min(1)]],

      expiryDate: ['', [Validators.required, this.futureDateValidator]],
      unit: [{ value: '', disabled: true }]
    });
  }

  addItem(): void {
    this.items.push(this.createItemRow());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // เมื่อเลือกสินค้า ให้ Auto-fill SKU และ Unit
  onProductChange(index: number): void {
    const selectedId = this.items.at(index).get('productId')?.value;
    const product = this.products.find(p => p.id === selectedId);

    if (product) {
      this.items.at(index).patchValue({
        sku: product.sku,
        unit: product.unit
      });
    }
  }

  async onSubmit() {
    console.log('Form Validity:', this.stockForm.valid);

    if (this.stockForm.invalid) {
      // วนลูปเช็คว่า Control ไหนที่มี Error
      Object.keys(this.stockForm.controls).forEach(key => {
        const controlErrors = this.stockForm.get(key)?.errors;
        if (controlErrors != null) {
          console.log('Key:', key, 'Errors:', controlErrors);
        }
      });

      // วนลูปเช็คใน FormArray (Items)
      this.items.controls.forEach((group: any, index) => {
        Object.keys(group.controls).forEach(key => {
          const errors = group.get(key).errors;
          if (errors) {
            console.log(`Item Row ${index} - Key: ${key}, Errors:`, errors);
          }
        });
      });
    } else {
      const payload = this.stockForm.getRawValue(); // ใช้ getRawValue เพื่อเอาค่าจาก field ที่ disabled ด้วย

      const response = await this.ApiService.patch('products/recive-stock', payload)
      console.log({ response });

    }
  }
}
