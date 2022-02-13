import * as _ from 'lodash';
import { BalanceAccountType, TransactionAction, TransactionStatus, TransactionType } from '@/modules/finance/const/transaction.const';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { DateTimeService } from '@/utility/services/datetime.service';
import { GetBalanceQueryModel } from '@/modules/finance/models/query.model';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'transaction-filter',
    templateUrl: './transaction-filter.component.html'
})
export class TransactionFilterComponent {
    @ViewChild('form') form: NgForm;

    @Output() search = new EventEmitter<GetBalanceQueryModel>();
    @Output() export = new EventEmitter<GetBalanceQueryModel>();
    @Output() onReset = new EventEmitter<QueryModel>();
    @Input() display: boolean;
    queryModel = new GetBalanceQueryModel();
    userCode: string = '';
    searchTime: Date[];
    _selectedUser: any;
    customerSearchCondition = {
        fields: 'fullName,phone,code',
        status: `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED},${Status.DELETED}`
    };
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    public statuses: TransactionStatus[] = [
        TransactionStatus.PROCESSING,
        TransactionStatus.SUCCESS,
        TransactionStatus.REQUEST,
        TransactionStatus.REJECT
    ];
    public actions: TransactionAction[] = [
        TransactionAction.DEPOSIT,
        TransactionAction.WITHDRAW,
        TransactionAction.PROMOTION,
        TransactionAction.FINE,
        TransactionAction.COMMISSION,
        TransactionAction.COLLECTION_MONEY,
        TransactionAction.ADJUST_ORDER,
        TransactionAction.ADJUST_DEPOSIT,
        TransactionAction.PAYMENT,
        TransactionAction.REFUND,
        TransactionAction.REFERRAL_BONUS
    ];
    public userTypes: BalanceAccountType[] = [
        BalanceAccountType.PARTNER,
        BalanceAccountType.CUSTOMER,
        BalanceAccountType.OWNER
    ];
    public wallets: TransactionType[] = [
        TransactionType.CASH,
        TransactionType.DEPOSIT,
        TransactionType.MAIN,
        TransactionType.SUB
    ];

    set selectedUser(value) {
        if (_.isArray(value) || value === null) {
            this._selectedUser = value;
            this.queryModel.userIds = value;
        }
    }

    get selectedUser() {
        return this._selectedUser;
    }

    constructor(
        public userService: CustomerService,
        public servierService: ServicerService,
        public modalService: ModalService,
        public translateService: TranslateService
    ) { }

    processTime() {
        if (!_.isEmpty(this.searchTime)) {
            this.queryModel.startTime = DateTimeService.convertDateToTimestamp(
                this.searchTime[0]
            );
            this.queryModel.endTime = DateTimeService.convertDateToTimestamp(
                this.searchTime[1],
                null,
                true
            );
        } else {
            delete this.queryModel.startTime;
            delete this.queryModel.endTime;
        }
    }

    async searchEvent() {
        this.processTime();
        this.search.emit(this.queryModel);
    }

    reset() {
        this.queryModel = new GetBalanceQueryModel();
        this.searchTime = [];
        this._selectedUser = null;
        CommonHelper.resetForm(this.form);
        this.searchEvent();
    }

    async exportEvent() {
        this.searchEvent();
        this.export.emit(this.queryModel);
    }
}
