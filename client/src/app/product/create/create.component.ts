import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/service/apiservice';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public router: Router
  ) {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+$')]],
      name: ['', Validators.required],
      category: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      brand: ['']
    });
  }
  ngOnInit(): void {

  }

  async onSubmit() {
    if (this.productForm.valid) {
      try {
        const response = await this.apiService.post('products', this.productForm.value);
        console.log('Product Created:', response);
        alert('สร้างสินค้าใหม่สำเร็จ!');
        this.router.navigate(['/dashboard/inventory']); // กลับหน้า List
      } catch (error) {
        console.error('Create Error:', error);
        alert('รหัส SKU นี้อาจมีอยู่แล้วในระบบ');
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
