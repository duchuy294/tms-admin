import * as _ from 'lodash';
import { AdjustDepositComponent } from './../adjust-deposit/adjust-deposit.component';
import { BonusForfeit } from '../bonus-forfeit/bonus-forfeit.component';
import { BonusForfeitComponent } from './../bonus-forfeit/bonus-forfeit.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GetBalanceQueryModel } from '@/modules/finance/models/query.model';
import { Notification } from '@/modules/finance/models/notification.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../../../models/query.model';
import { ReportService } from '@/modules/report/services/report.service';
import { TopUpComponent } from './../top-up/top-up.component';
import { TransactionGridComponent } from './../transaction-grid/transaction-grid.component';
import { TransactionModel } from '@/modules/finance/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'transaction-list',
    templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent implements OnInit {
    public displayFilter: boolean;
    public notification = new Notification();
    public model: TransactionModel[];
    public pagingModel = new PagingModel<TransactionModel>();
    public query = new GetBalanceQueryModel();
    public translateData: any;
    public visibleAdjustDepositModal: boolean = false;
    public visibleBonusModal: boolean = false;
    public visibleBonusFeiModal: boolean = false;
    public visibleTopUpModal: boolean = false;
    public bonusType: BonusForfeit = BonusForfeit.BONUS;
    public exporting = false;
    @ViewChild('bonusForm') bonusForm: BonusForfeitComponent;
    @ViewChild('bonusFeiForm') bonusFeiForm: BonusForfeitComponent;
    @ViewChild('topUpForm') topUpForm: TopUpComponent;
    @ViewChild('adjustDepositForm') adjustDepositForm: AdjustDepositComponent;
    @ViewChild('grid') grid: TransactionGridComponent;

    constructor(
        private translate: TranslateService,
        private message: NzMessageService,
        private reportService: ReportService,
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.translate
            .get(['button.reset', 'button.yes', 'button.cancel'])
            .subscribe(val => {
                this.translateData = val;
            });
    }

    async search(query: GetBalanceQueryModel) {
        this.grid.triggerLoadData(query);
    }

    async loadData() {
        this.grid.loadData();
    }

    showAdjustDepositModal() {
        this.handleVisibleAdjustDepositModal(true);
    }

    showTopUpModal() {
        this.visibleTopUpModal = true;
    }

    onTopUpConfirm() {
        this.topUpForm.confirm();
    }

    handleVisibleAdjustDepositModal(flag = false) {
        this.visibleAdjustDepositModal = !!flag;
        if (this.adjustDepositForm) {
            this.adjustDepositForm.reset();
        }
    }
    handleVisibleTopUpModal(flag = false) {
        this.visibleTopUpModal = !!flag;
        this.topUpForm.reset();
    }

    handleVisibleBonusModal(flag = false) {
        this.visibleBonusModal = !!flag;
        this.bonusForm.reset();
    }

    handleVisibleBonusFeiModal(flag = false) {
        this.visibleBonusFeiModal = !!flag;
        this.bonusFeiForm.reset();
    }

    showBonusModal() {
        this.bonusType = BonusForfeit.BONUS;
        this.visibleBonusModal = true;
    }

    showForfeitModal() {
        this.bonusType = BonusForfeit.FORFEIT;
        this.visibleBonusFeiModal = true;
    }

    onBonusConfirm() {
        this.bonusForm.confirm();
    }

    async onBonusConfirmHandle($event) {
        if ($event.error) {
            this.message.error(
                `Có lỗi xảy ra khi ${
                this.bonusType === BonusForfeit.FORFEIT
                    ? 'phạt tiền'
                    : 'thưởng tiền'
                }. Vui lòng thử lại`
            );
        } else {
            this.message.success(
                `${
                this.bonusType === BonusForfeit.FORFEIT
                    ? 'Phạt tiền'
                    : 'Thưởng tiền'
                } thành công`
            );
            if (this.bonusType === BonusForfeit.FORFEIT) {
                this.handleVisibleBonusFeiModal();
            } else {
                this.handleVisibleBonusModal();
            }
            await this.loadData();
        }
    }

    async onTopUpConfirmHandle($event) {
        if ($event.errorCode !== 0) {
            this.message.error(`${this.translate.instant(`actions.topup`)} ${this.translate.instant('common.failed').toLowerCase()}: ${$event.message}`);
        } else {
            this.message.success(`${this.translate.instant(`actions.topup`)} ${this.translate.instant('common.successfully').toLowerCase()}`);
            this.handleVisibleTopUpModal();
            await this.loadData();
        }
    }

    onBonusReset() {
        this.bonusForm.reset();
    }

    onBonusFeitConfirm() {
        this.bonusFeiForm.confirm();
    }

    onBonusFeitReset() {
        this.bonusFeiForm.reset();
    }

    onTopUpReset() {
        this.topUpForm.reset();
    }

    async onAdjustDepositConfirm() {
        const ok = await this.adjustDepositForm.confirm();
        if (ok) {
            this.handleVisibleAdjustDepositModal();
            this.adjustDepositForm.reset();
            await this.loadData();
        }
    }

    onAdjustDepositReset() {
        this.adjustDepositForm.reset();
        this.handleVisibleAdjustDepositModal();
    }

    async export(query = new QueryModel()) {
        this.exporting = true;
        await this.reportService.exportTransactions(query);
        this.exporting = false;
    }
}
