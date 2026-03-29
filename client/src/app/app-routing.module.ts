import { InventoryComponent } from './inventory/inventory.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCreateComponent } from './order-create/order-create.component';
import { LoginComponent } from './login/login.component';
import { OrderListComponent } from './order-list/order-list.component';
import { MainlayoutComponent } from './components/mainlayout/mainlayout.component';
import { AuthGuard } from './auth/auth.guard';
import { InventorycreateComponent } from './inventory/inventorycreate/inventorycreate.component';
import { InventoryadjustComponent } from './inventory/inventoryadjust/inventoryadjust.component';
import { InventoryhistoryComponent } from './inventory/inventoryhistory/inventoryhistory.component';
import { OrderdetailComponent } from './order/orderdetail/orderdetail.component';
import { OrdertrackComponent } from './order/ordertrack/ordertrack.component';
import { OrdercategoryComponent } from './order/ordercategory/ordercategory.component';
import { SuccessComponent } from './shared/ui/success/success.component';
import { DetailComponent } from './order/admin/detail/detail.component';
import { CreateComponent } from './product/create/create.component';
import { ViewComponent } from './product/view/view.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: MainlayoutComponent, // ตัวที่มี Sidebar
    canActivate: [AuthGuard], // กันคนไม่ Login เข้า
    children: [
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/create', component: OrderCreateComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'inventory/create', component: InventorycreateComponent },
      { path: 'inventory/adjust/:id', component: InventoryadjustComponent },
      { path: 'inventory/history/:id', component: InventoryhistoryComponent },
      { path: 'customer/track/:id', component: OrdertrackComponent },
      { path: 'customer/detail/:id', component: OrderdetailComponent },
      { path: 'customer/product', component: OrdercategoryComponent },
      { path: 'success/:id', component: SuccessComponent },
      { path: 'orders/admin/detail/:id', component: DetailComponent },


      { path: 'product/create', component: CreateComponent },


      { path: '', redirectTo: 'orders', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
