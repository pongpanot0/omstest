import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn, TableAction } from './table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  ngOnInit(): void {

  }
  // table.component.ts
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() actions: any[] = [];

  // ส่วนของ Pagination
  @Input() totalItems: number = 0; // รับมาจาก Backend res.meta.total
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    // คำนวณเลขที่สุดท้ายที่แสดง (เช่น 1 - 10 จาก 100)
    return Math.min(this.startIndex + this.data.length, this.totalItems);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  getProperty(obj: any, key: string) {
    return key.split('.').reduce((o, i) => (o ? o[i] : null), obj);
  }
}
