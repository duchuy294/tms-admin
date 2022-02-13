import { AccountBalanceFilterComponent } from './components/account-balance/account-balance-filter/account-balance-filter.component';
import { AccountBalanceGridComponent } from './components/account-balance/account-balance-grid/account-balance-grid.component';
import { AccountBalanceListComponent } from './components/account-balance/account-balance-list/account-balance-list.component';
import { AdjustDepositComponent } from './components/transaction/adjust-deposit/adjust-deposit.component';
import { AdminModule } from './../admin/admin.module';
import { ApiFinanceHttpService } from './services/api-finance-http.service';
import { AppTranslationModule } from '../app-translation/app-translation.module';
import { BalanceService } from './services/balance.service';
import { BankGridComponent } from './components/bank-grid/bank-grid.component';
import { BankService } from './services/bank.service';
import { BonusForfeitComponent } from './components/transaction/bonus-forfeit/bonus-forfeit.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CreateBankComponent } from './components/modals/create-bank/create-bank.component';
import { CreateSystemBankAccountComponent } from './components/modals/create-system-bank-account/create-system-bank-account.component';
import { CustomerTransactionGridComponent } from './components/customer-transaction-grid/customer-transaction-grid.component';
import { CustomerTransactionHistoryComponent } from './components/modals/customer-transaction-history/customer-transaction-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewPaymentCollectionComponent } from './components/new-payment-collection/new-payment-collection.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { PaymentCollectionComponent } from './components/payment-collection/payment-collection.component';
import { RouterModule } from '@angular/router';
import { ServicerBalanceModalComponent } from '@/pages/servicer-management/components/servicer/servicer-balance-modal/servicer-balance-modal.component';
import { ServicerModule } from './../servicer/servicer.module';
import { SystemBankAccountGridComponent } from './components/system-bank-account-grid/system-bank-account-grid.component';
import { SystemBankAccountService } from './services/system-bank-account.service';
import { TextMaskModule } from 'angular2-text-mask';
import { TopUpComponent } from './components/transaction/top-up/top-up.component';
import { TransactionDetailModalComponent } from './components/transaction-detail-modal/transaction-detail-modal.component';
import { TransactionFilterComponent } from './components/transaction/transaction-filter/transaction-filter.component';
import { SessionCodFilterComponent } from './components/session-cod/session-cod-filter/session-cod-filter.component';
import { TransactionGridComponent } from './components/transaction/transaction-grid/transaction-grid.component';
import { TransactionGridModalComponent } from './components/transaction-grid-modal/transaction-grid-modal.component';
import { TransactionListComponent } from './components/transaction/transaction-list/transaction-list.component';
import { TransactionService } from './services/transaction.service';
import { UpdateWalletComponent } from './components/modals/update-wallet/update-wallet.component';
import { UtilityModule } from '../utility/utility.module';
import { WalletService } from './services/wallet.service';
import { WithdrawService } from './services/withdrawal.service';
import { SessionCodListComponent } from './components/session-cod/session-cod-list/session-cod-list.component';
import { SessionCodService } from './services/session-cod.service';
import { RequestCodService } from './services/request-cod.service';
import { SessionCodGridComponent } from './components/session-cod/session-cod-gird/session-cod-gird.component';
import { RequestCodFilterComponent } from './components/request-cod/request-cod-filter/request-cod-filter.component';
import { RequestCodGridComponent } from './components/request-cod/request-cod-gird/request-cod-gird.component';
import { RequestCodListComponent } from './components/request-cod/request-cod-list/request-cod-list.component';
import { RequestCodConfirmComponent } from './components/request-cod/modal/request-cod-confirm/request-cod-confirm.component';
import { RequestCodRejectComponent } from './components/request-cod/modal/request-cod-reject/request-cod-reject.component';
import { RequestCodQuickConfirmComponent } from './components/request-cod/modal/request-cod-quick-confirm/request-cod-quick-confirm.component';
import { RequestDebtListComponent } from './components/request-debt/request-debt-list/request-debt-list.component';
import { RequestDebtGridComponent } from './components/request-debt/request-debt-gird/request-debt-gird.component';
import { RequestDebtFilterComponent } from './components/request-debt/request-debt-filter/request-debt-filter.component';
import { RequestDebtConfirmComponent } from './components/request-debt/modal/request-debt-confirm/request-debt-confirm.component';
import { ApiDeliveryHttpService } from '../delivery/services/api-delivery-http.service';

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule,
        ServicerModule,
        TextMaskModule,
        UtilityModule,
        ReactiveFormsModule
    ],
    declarations: [
        AccountBalanceFilterComponent,
        AccountBalanceGridComponent,
        AccountBalanceListComponent,
        AdjustDepositComponent,
        TransactionDetailModalComponent,
        TransactionGridComponent,
        TransactionGridModalComponent,
        BankGridComponent,
        BonusForfeitComponent,
        CreateBankComponent,
        CreateSystemBankAccountComponent,
        CustomerTransactionGridComponent,
        CustomerTransactionHistoryComponent,
        UpdateWalletComponent,
        PaymentCollectionComponent,
        SystemBankAccountGridComponent,
        TopUpComponent,
        TransactionFilterComponent,
        TransactionListComponent,
        TransactionGridComponent,
        NewPaymentCollectionComponent,
        ServicerBalanceModalComponent,
        SessionCodListComponent,
        SessionCodFilterComponent,
        SessionCodGridComponent,
        RequestCodListComponent,
        RequestCodFilterComponent,
        RequestCodGridComponent,
        RequestCodConfirmComponent,
        RequestCodRejectComponent,
        RequestCodQuickConfirmComponent,
        RequestDebtListComponent,
        RequestDebtGridComponent,
        RequestDebtFilterComponent,
        RequestDebtConfirmComponent
    ],
    exports: [
        AccountBalanceListComponent,
        TransactionGridComponent,
        TransactionGridModalComponent,
        BankGridComponent,
        CustomerTransactionHistoryComponent,
        UpdateWalletComponent,
        PaymentCollectionComponent,
        NewPaymentCollectionComponent,
        SystemBankAccountGridComponent,
        TransactionListComponent,
        SessionCodListComponent,
        ServicerBalanceModalComponent,
        SessionCodGridComponent,
        RequestCodListComponent,
        RequestCodFilterComponent,
        RequestCodGridComponent,
        RequestCodConfirmComponent,
        RequestCodRejectComponent,
        RequestCodQuickConfirmComponent,
        RequestDebtListComponent,
        RequestDebtGridComponent,
        RequestDebtFilterComponent,
        RequestDebtConfirmComponent
    ],
    entryComponents: [
        TransactionDetailModalComponent,
        TransactionGridModalComponent,
        PaymentCollectionComponent
    ],
    providers: [
        ApiFinanceHttpService,
        ApiDeliveryHttpService,
        BalanceService,
        BankService,
        SystemBankAccountService,
        WalletService,
        TransactionService,
        WithdrawService,
        SessionCodService,
        RequestCodService,
        DecimalPipe
    ]
})
export class FinanceModule {}
