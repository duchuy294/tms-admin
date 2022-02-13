import * as _ from 'lodash';
import { AdminPermission } from '@/constants/AdminPermissions';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderAction } from '@/modules/order/models/order-action.model';
import { OrderGridComponent } from './../../../../modules/order/components/order-grid/order-grid.component';
import { OrderModel } from './../../../../modules/order/models/order.model';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ReportService } from 'app/modules/report/services/report.service';
import { SessionService } from '@/modules/utility/services/session.service';
import { TransactionAction } from '@/modules/finance/const/transaction.const';

@Component({
    selector: 'service-collection',
    templateUrl: './collection.component.html'
})
export class CollectionComponent implements OnInit {
    @ViewChild('orderGrid') orderGrid: OrderGridComponent;
    public pagingModel = new PagingModel<OrderModel>();
    public displayFilter = true;
    public orderActions: OrderAction[] = [];
    public query = new QueryModel();
    order = new OrderModel();
    maxMoney: number = 0;
    transactionGridVisible = false;
    servicerId: string = null;
    public historyQuery = new QueryModel({
        action: TransactionAction.COLLECTION_MONEY
    });
    exporting = false;
    paymentCollectionVisible = false;
    visibleModal: boolean = false;

    get canCompareCOD() {
        const profile = this.sessionService.getCurrentUser();
        return profile.roles.includes(AdminPermission.COMPARE_COD);
    }

    constructor(
        private reportService: ReportService,
        private sessionService: SessionService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.orderActions = [
            new OrderAction({
                name: 'common.detail',
                perform: this.openTransactionModal.bind(this)
            })];
    }

    async search(query: QueryModel) {
        query.page = 1;
        this.query = query;
        await this._reload();
    }

    async pageChange() {
        this.query.page = this.pagingModel.page;
        this.query.limit = this.pagingModel.limit;
        await this._reload();
    }
    
    async openTransactionModal(order: OrderModel) {
        this.historyQuery.orderId = order._id;
        this.handleTransactionGridVisible(true);
    }

    async _reload() {
        this.orderGrid.loadData(this.query);
    }

    async export() {
        this.exporting = true;
        const query = _.cloneDeep(this.query);
        await this.reportService.exportCOD(query);
        this.exporting = false;
    }

    async handleAfterSubmit() {
        await this._reload();
    }

    handleTransactionGridVisible(flag = true) {
        this.transactionGridVisible = !!flag;
    }

    showModal() {
        this.visibleModal = true;
    }
}