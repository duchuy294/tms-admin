import { AccountModel } from 'app/modules/admin/models/admin.model';
import { BaseNameModel } from 'app/models/BaseModel';
import { Component } from '@angular/core';
import { IResponse } from '@/modules/http/models/IResponse';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TransactionModel } from '../../models/transaction.model';
import { TransactionType } from '../../const/transaction.const';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawService as WithdrawalService } from '../../services/withdrawal.service';

@Component({
    selector: 'transaction-detail-modal',
    templateUrl: 'transaction-detail-modal.component.html'
})
export class TransactionDetailModalComponent {
    model: TransactionModel;
    from = [TransactionType.BANK, TransactionType.CASH];
    user: BaseNameModel;
    verifier: AccountModel;
    performer: AccountModel;
    change: () => void;

    constructor(
        public modalRef: NzModalRef,
        public withdrawalService: WithdrawalService,
        private messageService: NzMessageService,
        private translateService: TranslateService) { }

    async handle() {
        const response = await this.withdrawalService.process(this.model);
        this._processAfterRequest(response);
    }

    async process() {
        const response = await this.withdrawalService.approve(this.model);
        this._processAfterRequest(response);
    }

    async reject() {
        const response = await this.withdrawalService.reject(this.model);
        this._processAfterRequest(response);
    }

    private _processAfterRequest(response: IResponse) {
        if (response.errorCode !== 0) {
            this.messageService.error(response.message);
        } else {
            this.messageService.success(this.translateService.instant('common.successfully'));
            if (this.change) {
                this.change();
            }
            this.modalRef.close();
        }
    }
}