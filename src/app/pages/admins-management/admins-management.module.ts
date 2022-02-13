import { AdminModule } from '../../modules/admin/admin.module';
import { AdminsComponent } from './components/admins/admins.component';
import { AdminsGridComponent } from './components/admins-grid/admins-grid.component';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { CreateGroupAdminComponent } from './components/group-admins/create-group-admin/create-group-admin.component';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { FilterComponent } from './components/filter/filter.component';
import { FormsModule } from '@angular/forms';
import { GridGroupAdminComponent } from './components/group-admins/grid-group-admin/grid-group-admin.component';
import { GroupAdminsComponent } from './components/group-admins/group-admins.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { PrivilegePageComponent } from './pages/privilege-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { SettingModule } from '@/modules/system-setting/setting.module';
import { UtilityModule } from './../../modules/utility/utility.module';

const routes: Routes = [
    { path: 'admins', component: AdminsComponent },
    { path: 'group-admins', component: GroupAdminsComponent },
    { path: 'privilege', component: PrivilegePageComponent }
];

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule.forChild(routes),
        UtilityModule,
        SettingModule,
    ],
    declarations: [
        AdminsComponent,
        CreateAccountComponent,
        CreateGroupAdminComponent,
        FilterComponent,
        GroupAdminsComponent,
        PrivilegePageComponent,
        AdminsGridComponent,
        GridGroupAdminComponent
    ],
    entryComponents: [
        CreateAccountComponent,
        CreateGroupAdminComponent,
    ],
    providers: [
        CustomerService,
        ServicerService
    ],
})
export class AdminsManagementModule { }
