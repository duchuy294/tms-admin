import * as _ from 'lodash';
import { AccountType } from 'app/constants/AccountType';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderGridComponent } from './../../../../../modules/order/components/order-grid/order-grid.component';
import { OrderModel } from '../../../../../modules/order/models/order.model';
import { PagingModel } from '../../../../../modules/utility/components/paging/paging.model';
import { PaymentCollectionComponent } from './../../../../../modules/finance/components/payment-collection/payment-collection.component';
import { QueryModel } from '../../../../../models/query.model';
import { TransactionModel } from '@/modules/finance/models/transaction.model';
import { WalletModel } from 'app/modules/finance/models/wallet.model';
import { WalletService } from './../../../../../modules/finance/services/wallet.service';

@Component({
    selector: 'collection-order',
    templateUrl: 'collection-order.component.html'
})
export class CollectionOrderComponent implements OnInit {
    @ViewChild('orderGrid') orderGrid: OrderGridComponent;
    public wallet: WalletModel;
    public orderPaging = new PagingModel<OrderModel>();
    public paidMoney = 0;
    public query = new QueryModel();
    public model = new TransactionModel();

    constructor(
        private ngbModal: NgbModal,
        private walletService: WalletService
    ) { }

    async ngOnInit() {
        await this._reload();
    }

    async _loadOrders() {
        this.query.page = this.orderPaging.page;
        this.query.limit = this.orderPaging.limit;
        this.orderGrid.loadCollectionData(this.query);
    }

    async payCollectionDebt() {
        const modal = this.ngbModal.open(PaymentCollectionComponent)
            .componentInstance as PaymentCollectionComponent;
        modal.servicerId = this.wallet.userId;
        modal.maxMoney = this.wallet.collectionDebt;
        modal.completed = this._reload.bind(this);
    }

    async _reload() {
        const wallet = await this.walletService.get(this.wallet.userId, AccountType.SERVICER);
        if (this.wallet) {
            _.assignIn(this.wallet, wallet);
        } else {
            this.wallet = wallet;
        }
        await this._loadOrders();
    }
}