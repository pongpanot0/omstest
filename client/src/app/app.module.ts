import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderCreateComponent } from './order-create/order-create.component';
import { MainlayoutComponent } from './components/mainlayout/mainlayout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HasRoleDirective } from './shared/has-role.directive';
import { CardComponent } from './shared/ui/card/card.component';
import { TableComponent } from './shared/ui/table/table.component';
import { ButtonComponent } from './shared/ui/button/button.component';
import { TextComponent } from './shared/ui/text/text.component';
import { InputComponent } from './shared/ui/input/input.component';
import { SelectComponent } from './shared/ui/select/select.component';
import { InventoryComponent } from './inventory/inventory.component';

import { InventorycreateComponent } from './inventory/inventorycreate/inventorycreate.component';
import { InventoryadjustComponent } from './inventory/inventoryadjust/inventoryadjust.component';
import { InventoryhistoryComponent } from './inventory/inventoryhistory/inventoryhistory.component';
import { OrdertrackComponent } from './order/ordertrack/ordertrack.component';
import { OrderdetailComponent } from './order/orderdetail/orderdetail.component';
import { OrdercategoryComponent } from './order/ordercategory/ordercategory.component';
import { SuccessComponent } from './shared/ui/success/success.component';
import { RouterModule } from '@angular/router';
import { DetailComponent } from './order/admin/detail/detail.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateComponent } from './product/create/create.component';
import { ViewComponent } from './product/view/view.component';
import { CurrencyFormatPipe } from './shared/pipes/currency-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrderListComponent,
    OrderCreateComponent,
    MainlayoutComponent,
    HasRoleDirective,
    CardComponent,
    TableComponent,
    ButtonComponent,
    TextComponent,
    InputComponent,
    SelectComponent,
    InventoryComponent,
    InventorycreateComponent,
    InventoryadjustComponent,
    InventoryhistoryComponent,
    OrdertrackComponent,
    OrderdetailComponent,
    OrdercategoryComponent,
    SuccessComponent,
    DetailComponent,
    CreateComponent,
    ViewComponent,
    CurrencyFormatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
