import { AdditionServiceComponent } from './components/price/delivery/addition-service.component';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { BankManagementComponent } from './components/bank-management/bank-management.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { CategoriesService } from './services/categories.service';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { DeliveryModule } from './../../modules/delivery/delivery.module';
import { EmailAccountComponent } from './components/email-account/email-account.component';
import { EmailModule } from '@/modules/email-management/email.module';
import { EmailTemplateComponent } from './components/email-template/email-template.component';
import { FilterComponent } from './components/filter/filter.component';
import { FinanceModule } from '@/modules/finance/finance.module';
import { FormsModule } from '@angular/forms';
import { HookManagementComponent } from './components/hook-management/hook-management.component';
import { HookModule } from '@/modules/hook/hook.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { PlaceManagementComponent } from '../system-setting-management/components/place-management/place-management.component';
import { PriceComponent } from './components/price/price.component';
import { PriceDeliveryComponent } from './components/price/delivery/price-delivery.component';
import { PriceFormComponent } from 'app/pages/settings-management/components/price/price-form.component';
import { PriceInstallationComponent } from './components/price/installation/price-installation.component';
import { PriceModifyComponent } from './components/price/price-modify/price-modify.component';
import { PriceModule } from 'app/modules/price/price.module';
import { PriceSettingService } from './services/price-setting.service';
import { ReasonTemplateComponent } from './components/reason-template/reason-template.component';
import { ReasonTemplateModule } from './../../modules/reason-template/reason-template.module';
import { RouterModule, Routes } from '@angular/router';
import { ServiceGroupModalComponent } from './components/price/installation/service-group-modal.component';
import { ServiceModalComponent } from './components/price/installation/service-modal.component';
import { ServicePricingComponent } from './components/price/service-pricing/service-pricing.component';
import { ServicePricingGridComponent } from './components/price/service-pricing/service-pricing-grid/service-pricing-grid.component';
import { ServiceUnitService } from './services/service-unit.service';
import { SettingModule } from '@/modules/system-setting/setting.module';
import { SmsManagementComponent } from '../settings-management/components/sms-management/sms-management.component';
import { TelecomModule } from '@/modules/telecom/telecom.module';
import { UserLevelComponent } from './components/user-level/user-level.component';
import { UserModule } from '@/modules/user/user.module';
import { UtilityModule } from './../../modules/utility/utility.module';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { VehicleModule } from '@/modules/vehicle/vehicle.module';
import { VehicleSizeService } from './services/vehicle-size.service';
import { WarrantyRepairModule } from '@/modules/warranty-repair/warranty-repair.module';

const routes: Routes = [
    { path: 'price', component: PriceFormComponent },
    { path: 'price/:id', component: PriceComponent },
    { path: 'user-level', component: UserLevelComponent },
    { path: 'reason-template', component: ReasonTemplateComponent },
    { path: 'bank', component: BankManagementComponent },
    { path: 'city-province', component: PlaceManagementComponent },
    { path: 'hook', component: HookManagementComponent },
    { path: 'email-template', component: EmailTemplateComponent },
    { path: 'email-account', component: EmailAccountComponent },
    { path: 'sms', component: SmsManagementComponent },
    { path: 'vehicle', component: VehicleComponent },
    { path: 'categories', component: CategoriesComponent }
];

@NgModule({
    imports: [
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        DeliveryModule,
        EmailModule,
        FinanceModule,
        FormsModule,
        HookModule,
        NgbModule,
        PriceModule,
        ReasonTemplateModule,
        RouterModule.forChild(routes),
        SettingModule,
        TelecomModule,
        UserModule,
        VehicleModule,
        CategoriesModule,
        UtilityModule,
        WarrantyRepairModule,
        NzPopconfirmModule,
    ],
    declarations: [
        AdditionServiceComponent,
        BankManagementComponent,
        EmailAccountComponent,
        EmailTemplateComponent,
        FilterComponent,
        HookManagementComponent,
        PlaceManagementComponent,
        PriceComponent,
        PriceDeliveryComponent,
        PriceFormComponent,
        PriceInstallationComponent,
        ReasonTemplateComponent,
        ServiceGroupModalComponent,
        ServiceModalComponent,
        ServicePricingComponent,
        ServicePricingGridComponent,
        SmsManagementComponent,
        UserLevelComponent,
        VehicleComponent,
        CategoriesComponent,
        PriceModifyComponent
    ],
    providers: [
        PriceSettingService,
        ServiceUnitService,
        VehicleSizeService,
        CategoriesService
    ],
    entryComponents: [ServiceGroupModalComponent, ServiceModalComponent]
})
export class SettingsManagementModule { }
