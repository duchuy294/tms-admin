import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { OrderModule } from '@/modules/order/order.module';
import { RouterModule, Routes } from '@angular/router';
import { UtilityModule } from '@/utility/utility.module';
import { WarehouseDetailComponent } from '@/modules/warehouse/components/warehouse/warehouse-detail/warehouse-detail.component';
import { WarehouseManagementComponent } from './components/warehouse-management/warehouse-management.component';
import { WarehouseModule } from '@/modules/warehouse/warehouse.module';
import { WarehouseSettingComponent } from './components/warehouse-setting/warehouse-setting.component';

const routes: Routes = [
  { path: 'warehouse-management', component: WarehouseManagementComponent, },
  { path: 'detail/:id', component: WarehouseDetailComponent, },
  { path: 'warehouse-setting', component: WarehouseSettingComponent, }
];

@NgModule({
  imports: [
    AppTranslationModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    UtilityModule,
    WarehouseModule,
    OrderModule,
  ],
  declarations: [
    WarehouseManagementComponent,
    WarehouseSettingComponent,
  ],
  entryComponents: []
})
export class WarehouseManagementModule { }
