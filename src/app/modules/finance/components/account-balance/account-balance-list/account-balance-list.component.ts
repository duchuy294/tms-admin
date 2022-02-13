import { AccountBalanceFilterComponent } from './../account-balance-filter/account-balance-filter.component';
import { AccountBalanceGridComponent } from './../account-balance-grid/account-balance-grid.component';
import { AccountType } from '@/constants/AccountType';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryModel } from '@/models/query.model';
import { ReportService } from '@/modules/report/services/report.service';
import { Servicer } from '../../../../../modules/servicer/models/servicer/servicer.model';
import { ServicerService } from '../../../../../modules/servicer/services/servicer.service';
import { TransactionType } from '@/modules/finance/const/transaction.const';
import { WalletEditModel } from '@/modules/finance/models/wallet-edit.model';
import { WalletModel } from '@/modules/finance/models/wallet.model';
import { WalletService } from '@/modules/finance/services/wallet.service';

@Component({
    selector: 'account-balance-list',
    templateUrl: './account-balance-list.component.html'
})
export class AccountBalanceListComponent implements OnInit {
    @ViewChild('filter') filter: AccountBalanceFilterComponent;
    @ViewChild('grid') grid: AccountBalanceGridComponent;
    loading: boolean = false;
    filterVisible: boolean = false;
    wallets = [TransactionType.MAIN, TransactionType.SUB, TransactionType.DEPOSIT, TransactionType.COLLECTION];
    statisticData = [];
    visibleTransactionHistory: boolean = false;
    visibleWalletUpdate: boolean = false;
    wallet: WalletModel = null;
    walletUpdate: WalletEditModel = null;
    customerId = [];
    public servicer = new Servicer();
    historyTransactionGridVisible = false;
    historyTransactionQuery = new QueryModel();

    constructor(
        private reportService: ReportService,
        private walletService: WalletService,
        private service: ServicerService,
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.loading = true;
        this.wallets.forEach(item => {
            this.statisticData.push({
                title: `finance-wallet.statistics.total-${item}`,
                value: 0
            });
        });
        const response = await this.walletService.getStatistics();
        if (response) {
            this.processStat(response.data);
        }
        this.loading = false;
    }

    toggleFilter() {
        this.filterVisible = !this.filterVisible;
    }

    async export(query: QueryModel) {
        this.loading = true;
        await this.reportService.exportAccountBalance(query);
        this.loading = false;
    }

    async search(query: QueryModel) {
        const response = await this.walletService.getStatistics(query);
        if (response) {
            this.processStat(response.data);
        }
        this.grid.triggerLoadData(query);
    }

    processStat(data) {
        this.wallets.forEach((item, index) => {
            item = item.charAt(0).toUpperCase() + item.slice(1);
            this.statisticData[index].value = data[`total${item}`];
        });
    }

    exportFilter() {
        this.filter.exportFilter();
    }
    handleVisibleTransactionHistory(flag = false) {
        this.visibleTransactionHistory = !!flag;
    }
    handleVisibleWalletUpdate(flag = false) {
        this.visibleWalletUpdate = !!flag;
    }
    async receivingWallet($event = new WalletModel()) {
        this.wallet = $event;
        if (this.wallet.userType === AccountType.USER) {
            this.customerId = [this.wallet.userId];
            this.handleVisibleTransactionHistory(true);
        } else {
            this.servicer = await this.service.get(this.wallet.userId);
            this.openFinanceHistoryModal();
        }
    }

    async receivingWalletUpdate($event = new WalletEditModel()) {
        this.walletUpdate = $event;
        this.handleVisibleWalletUpdate(true);
    }

    openFinanceHistoryModal() {
        this.historyTransactionQuery.userId = this.servicer._id;
        this.handleHistoryTransactionGridVisible(true);
    }

    afterUpdateWallet() {
        this.grid.loadData();
    }

    handleHistoryTransactionGridVisible(flag = true) {
        this.historyTransactionGridVisible = !!flag;
    }
}
