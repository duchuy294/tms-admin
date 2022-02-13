import * as _ from 'lodash';
import { BalanceService } from '../../services/balance.service';
import { BankService } from '../../services/bank.service';
import { CommonHelper } from './../../../utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderModel } from './../../../order/models/order.model';
import { QueryModel } from '@/models/query.model';
import { Servicer } from 'app/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';
import { TransactionModel } from '@/modules/finance/models/transaction.model';
import { TransactionType } from '../../const/transaction.const';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'new-payment-collection',
    templateUrl: './new-payment-collection.component.html'
})
export class NewPaymentCollectionComponent implements OnInit, OnChanges {
    model = new TransactionModel({ value: 1, from: TransactionType.CASH });
    servicer: Servicer;
    isProcessing = false;
    @Input() servicerId: string = null;
    @Input() order: OrderModel = null;
    @Input() maxMoney: number = 0;
    @Input() visible = false;
    completed: () => void;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    get errorParams() {
        return { maxMoney: this.maxMoney.toLocaleString() };
    }
    depositMethods = [
        TransactionType.CASH,
        TransactionType.BANK,
        TransactionType.MAIN
    ];
    banks: string[] = [];
    visibleModal = true;

    constructor(
        public balanceService: BalanceService,
        public servicerService: ServicerService,
        private bankService: BankService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    public async ngOnInit() {
        this.isProcessing = true;
        await this.loadServicer();
        await this.getBanks();
        this.isProcessing = false;
    }

    public async ngOnChanges() {
        this.isProcessing = true;
        this.model = new TransactionModel({ value: this.maxMoney, from: TransactionType.CASH });
        await this.loadServicer();
        this.isProcessing = false;
    }

    public async confirm() {
        if (this.order) {
            this.model.orderId = this.order._id;
        }
        this.model.userId = this.servicerId;
        const result = await this.balanceService.payCollectionForServicer(this.model);
        if (result.errorCode === 0) {
            this.afterSubmit.emit();
            this.handleVisibleModel(false);
            this.messageService.success(`${this.translateService.instant('common.successfully').toLowerCase()}`);
            this.reset();
        } else {
            this.messageService.error((result.data && result.data[0]) ? result.data[0].message : result.message);
        }
    }

    handleVisibleModel(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    public async loadServicer() {
        if (this.order) {
            this.servicer = await this.servicerService.get(this.servicerId);
        }
    }

    async getBanks() {
        const query = new QueryModel({ limit: 1000, status: `${Status.ACTIVE}` });
        const bankPaging = await this.bankService.filter(query);
        this.banks = _.map(bankPaging.data, item => item.name);
    }

    reset() {
        CommonHelper.resetForm(this.createModifyForm);
    }
}
