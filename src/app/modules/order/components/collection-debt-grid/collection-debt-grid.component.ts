import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderModel } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from './../../../../models/query.model';

@Component({
    selector: 'collection-debt-grid',
    templateUrl: './collection-debt-grid.component.html'
})

export class CollectionDebtGridComponent implements OnInit {
    loading: boolean = false;
    modelQuery = new QueryModel();
    unsubmittedMoney: number = 0;

    public tableData = new PagingModel<OrderModel>();

    @Input()
    set model(value) {
        this.modelQuery = value;
    }

    @Input()
    set userId(value) {
        this.modelQuery.userId = value;
    }

    @Output() unsubmittedCollectionMoney = new EventEmitter<number>();

    constructor(
        private orderService: OrderService
    ) { }

    async ngOnInit() {
        await this.loadData();
        this.getUnsubmittedMoney();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.orderService.getCollectionOrders(this.modelQuery);
        const verifyQuery = this.orderService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.orderService.getCollectionOrders(this.modelQuery);
        }
        this.loading = false;
    }

    async loadDataByPage(event) {
        this.modelQuery.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event) {
        this.modelQuery.limit = event;
        await this.loadData();
    }

    getUnsubmittedMoney() {
        _.forEach(this.tableData.data, data => {
            this.unsubmittedMoney += data.cod ? data.cod.remaining : 0;
        });
        this.unsubmittedCollectionMoney.emit(this.unsubmittedMoney);
    }
}