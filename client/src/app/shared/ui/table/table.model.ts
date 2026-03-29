// table-shared.model.ts
export interface TableColumn {
  key: string;       // ชื่อ field ใน data (เช่น 'id', 'customerName')
  label: string;     // หัวข้อที่จะโชว์ในตาราง (เช่น 'Order ID')
  type?: 'text' | 'date' | 'currency' | 'badge'; // สำหรับจัด format
}

export interface TableAction {
  label: string;
  icon?: string;
  class?: string;
  callback: (row: any) => void; // ฟังก์ชันที่จะรันเมื่อกดปุ่ม
  showIf?: (row: any) => boolean; // (Optional) เงื่อนไขการโชว์ปุ่ม
}
