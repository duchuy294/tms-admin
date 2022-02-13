import { AdminModule } from './../../modules/admin/admin.module';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { DeliveryModule } from './../../modules/delivery/delivery.module';
import { FormsModule } from '@angular/forms';
import { MarketingModule } from '../../modules/marketing/marketing.module';
import { MenuItemModalComponent } from './components/menu-item-modal/menu-item-modal.component';
import { MenuManagementComponent } from './components/menu-management/menu-management.component';
import { MenuRoleModalComponent } from './components/menu-role-modal/menu-role-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicerModule } from './../../modules/servicer/servicer.module';
import { SettingModule } from '@/modules/system-setting/setting.module';
import { UtilityModule } from '../../modules/utility/utility.module';

const routes: Routes = [
    { path: 'menu', component: MenuManagementComponent },
];

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        DeliveryModule,
        FormsModule,
        MarketingModule,
        NgbModule,
        RouterModule.forChild(routes),
        ServicerModule,
        SettingModule,
        UtilityModule,
    ],
    declarations: [
        MenuItemModalComponent,
        MenuManagementComponent,
        MenuRoleModalComponent,
    ],
    entryComponents: [
        MenuItemModalComponent,
        MenuRoleModalComponent,
    ]
})
export class SystemSettingManagementModule { }
