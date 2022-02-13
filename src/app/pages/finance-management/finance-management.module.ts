import { AccountBalanceComponent } from './components/account-balance/account-balance.component';
import { AdminModule } from './../../modules/admin/admin.module';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { CollectionComponent } from './components/collection/collection.component';
import { CollectionFilterComponent } from './components/collection/filter/collection-filter.component';
import { CheckCodComponent } from './components/collection/check-cod/check-cod.component';
import { CommonModule } from '@angular/common';
import { CustomerModule } from '../../modules/customer/customer.module';
import { FinanceModule } from 'app/modules/finance/finance.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrderModule } from '@/modules/order/order.module';
import { ReportModule } from '@/modules/report/report.module';
import { RouterModule, Routes } from '@angular/router';
import { ServicerModule } from '../../modules/servicer/servicer.module';
import { SystemBankAccountComponent } from './components/system-bank-account/system-bank-account.component';
import { TextMaskModule } from 'angular2-text-mask';
import { TransactionComponent } from './components/transaction/transaction.component';
import { SessionCodComponent } from './components/session-cod/session-cod.component';
import { UserModule } from '@/modules/user/user.module';
import { UtilityModule } from './../../modules/utility/utility.module';
import { SessionCodCreateComponent } from '@/modules/finance/components/session-cod/session-code-create/session-cod-create.component';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { SessionCodDetailComponent } from '@/modules/finance/components/session-cod/session-cod-detail/session-cod-detail.component';
import { RequestCodDetailComponent } from '@/modules/finance/components/request-cod/request-cod-detail/request-cod-detail.component';
const routes: Routes = [
    { path: 'account-balance', component: AccountBalanceComponent },
    { path: 'collection', component: CollectionComponent },
    { path: 'system-bank-account', component: SystemBankAccountComponent },
    { path: 'transaction', component: TransactionComponent },
    { path: 'session-cod', component: SessionCodComponent },
    { path: 'session-cod/create', component: SessionCodCreateComponent },
    { path: 'session-cod/:id', component: SessionCodDetailComponent },
    { path: 'request-cod/:id', component: RequestCodDetailComponent },
];

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CommonModule,
        CustomerModule,
        CustomerModule,
        FinanceModule,
        FormsModule,
        OrderModule,
        NgbModule,
        ReactiveFormsModule,
        ReportModule,
        RouterModule.forChild(routes),
        ServicerModule,
        ServicerModule,
        TextMaskModule,
        UserModule,
        UtilityModule,
        NzTransferModule,
    ],
    declarations: [
        AccountBalanceComponent,
        CollectionComponent,
        CollectionFilterComponent,
        SystemBankAccountComponent,
        TransactionComponent,
        CheckCodComponent,
        SessionCodComponent,
        SessionCodCreateComponent,
        SessionCodDetailComponent,
        RequestCodDetailComponent,
    ],
    entryComponents: [
    ],
    exports: [
        NzTransferModule
    ]
})
export class FinanceManagementModule { }
