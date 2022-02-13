import { ApiWarrantyHttpService } from 'app/modules/warranty-repair/services/api-warranty-http.service';
import { ApiWarrantyHttpServiceObservable } from 'app/modules/warranty-repair/services/api-warranty-http.service.observable';
import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { BrandGridComponent } from './components/brand-grid/brand-grid.component';
import { BrandService } from './services/brand.service';
import { BrandServiceObservable } from 'app/modules/warranty-repair/services/brand.service.observable';
import { CommonModule } from '@angular/common';
import { CreateBrandComponent } from './components/modals/create-brand/create-brand.component';
import { CreateProductTypeComponent } from './components/modals/create-product-type/create-product-type.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ProductTypeGridComponent } from './components/product-type-grid/product-type-grid.component';
import { ProductTypeService } from './services/product-type.service';
import { StoreService } from 'app/modules/warranty-repair/services/store.service';
import { StoreServiceObservable } from 'app/modules/warranty-repair/services/store.service.observable';
import { UtilityModule } from '@/utility/utility.module';

@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        FormsModule,
        UtilityModule,
    ],
    declarations: [
        BrandGridComponent,
        CreateBrandComponent,
        CreateProductTypeComponent,
        ProductTypeGridComponent,
    ],
    providers: [
        ApiWarrantyHttpService,
        ApiWarrantyHttpServiceObservable,
        BrandService,
        BrandServiceObservable,
        ProductTypeService,
        StoreService,
        StoreServiceObservable,
    ],
    exports: [
        BrandGridComponent,
        ProductTypeGridComponent,
    ]
})
export class WarrantyRepairModule { }
