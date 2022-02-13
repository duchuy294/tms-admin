import { AppHttpModule } from './../../modules/http/app-http.module';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { CustomerDetailComponent } from '../../modules/customer/components/customers/customer-detail/customer-detail.component';
import { CustomerManagementComponent } from './components/customer/customer-management.component';
import { CustomerModule } from '../../modules/customer/customer.module';
import { DeliveryPointListComponent } from '@/modules/customer/components/customers/customer-detail/enduser/delivery-point-list/delivery-point-list.component';
import { EndUserListComponent } from '@/modules/customer/components/customers/customer-detail/enduser/enduser-list/enduser-list.component';
import { FinanceModule } from './../../modules/finance/finance.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserModule } from 'app/modules/user/user.module';
import { UtilityModule } from './../../modules/utility/utility.module';

const routes: Routes = [
    { path: 'personal', component: CustomerManagementComponent },
    { path: 'personal/detail/:id', component: CustomerDetailComponent, runGuardsAndResolvers: 'paramsChange' },
    { path: 'personal/detail/:id/end-user', component: EndUserListComponent },
    { path: 'personal/detail/:id/end-user/:endUserId/sub-end-user', component: DeliveryPointListComponent },
];

@NgModule({
    imports: [
        AppHttpModule,
        AppTranslationModule,
        CommonModule,
        CustomerModule,
        FinanceModule,
        FormsModule,
        NgbModule,
        RouterModule.forChild(routes),
        UserModule,
        UtilityModule,
    ],
    declarations: [
        CustomerManagementComponent,
    ]
})

export class CustomerManagementModule { }
