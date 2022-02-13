import * as _ from 'lodash';
import { BalanceService } from './../../services/balance.service';
import { BankService } from '../../services/bank.service';
import { Component, OnChanges, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModel } from 'app/modules/order/models/order.model';
import { QueryModel } from '@/models/query.model';
import { Servicer } from 'app/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';
import { TransactionModel } from '@/modules/finance/models/transaction.model';
import { TransactionType } from '../../const/transaction.const';

@Component({
    selector: 'payment-collection',
    templateUrl: './payment-collection.component.html'
})
export class PaymentCollectionComponent implements OnInit, OnChanges {
    order: OrderModel;
    maxMoney: number = 0;
    model = new TransactionModel({ value: 0, from: TransactionType.CASH });
    servicer: Servicer;
    servicerId: string;
    completed: () => void;
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
        public activeModal: NgbActiveModal,
        public balanceService: BalanceService,
        public servicerService: ServicerService,
        private bankService: BankService
    ) { }

    public async ngOnInit() {
        await this.loadServicer();
        await this.getBanks();
    }

    public async ngOnChanges() {
        await this.loadServicer();
    }

    public async confirm() {
        if (this.order) {
            this.model.orderId = this.order._id;
        }
        this.model.userId = this.servicerId;
        const result = await this.balanceService.payCollectionForServicer(this.model);
        if (result.errorCode === 0) {
            this.activeModal.close();
            if (this.completed) {
                await this.completed();
            }
        } else {
            window.alert(result.message);
        }
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
}
