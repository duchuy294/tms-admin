import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { CreateStoreModalComponent } from './components/modals/create-store-modal/create-store-modal.component';
import { effects } from '@/modules/warranty-repair/effects';
import { EffectsModule } from '@ngrx/effects';
import { FilterOrderStoreComponent } from './components/filter-order-store/filter-order-store.component';
import { FilterStoreComponent } from './components/filter/filter-store/filter-store.component';
import { FormsModule } from '@angular/forms';
import { GridOrderStoreComponent } from './components/grid-order-store/grid-order-store.component';
import { NgModule } from '@angular/core';
import { OrdersByStoreComponent } from './components/orders-by-store/orders-by-store.component';
import { reducers } from '@/modules/warranty-repair/reducers';
import { RouterModule, Routes } from '@angular/router';
import { ServicerModule } from '@/modules/servicer/servicer.module';
import { StoreGridComponent } from './components/store-grid/store-grid.component';
import { StoreInfoComponent } from './components/store-info/store-info.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreModule } from '@ngrx/store';
import { StoreTypeItemComponent } from './components/store-type-item/store-type-item.component';
import { UtilityModule } from '@/modules/utility/utility.module';
import { WarrantyRepairComponent } from './components/warranty-repair/warranty-repair.component';
import { WarrantyRepairModule } from 'app/modules/warranty-repair/warranty-repair.module';

const routes: Routes = [
    { path: 'store-list', component: StoreListComponent },
    { path: 'store-list/:id', component: OrdersByStoreComponent },
    { path: 'warranty-repair', component: WarrantyRepairComponent }
];

@NgModule({
    imports: [
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        EffectsModule.forFeature(effects),
        FormsModule,
        RouterModule.forChild(routes),
        ServicerModule,
        StoreModule.forFeature('warranty', reducers),
        UtilityModule,
        WarrantyRepairModule,
    ],
    declarations: [
        CreateStoreModalComponent,
        FilterOrderStoreComponent,
        FilterStoreComponent,
        GridOrderStoreComponent,
        OrdersByStoreComponent,
        StoreGridComponent,
        StoreInfoComponent,
        StoreListComponent,
        StoreTypeItemComponent,
        WarrantyRepairComponent,
    ]
})
export class WarrantyRepairManagementModule { }
