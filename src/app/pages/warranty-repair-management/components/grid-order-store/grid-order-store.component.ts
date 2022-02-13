import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderStoreModel } from '@/modules/warranty-repair/models/order-store.model';
import { OrderStoreQueryModel } from '@/modules/warranty-repair/models/order-store-query.model';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { StoreModel } from '@/modules/warranty-repair/models/store.model';
import { StoreService } from '@/modules/warranty-repair/services/store.service';

@Component({
    selector: 'grid-order-store',
    templateUrl: './grid-order-store.component.html'
})
export class GridOrderStoreComponent implements OnInit {
    @Output() modelChange = new EventEmitter();
    @Output() detail = new EventEmitter<string>();
    @Input() store: StoreModel;
    modelQuery = new OrderStoreQueryModel();
    loading: boolean = false;
    pageSize: number = 15;
    pageIndex: number = 1;
    public tableData = new PagingModel<OrderStoreModel>();

    constructor(private storeService: StoreService) { }

    ngOnInit() {
        this.modelQuery.limit = this.pageSize;
        this.loadData();
    }

    @Input()
    set model(value: OrderStoreQueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }

    loadDataByPage($event) {
        this.modelQuery.page = $event;
        this.modelChange.emit(this.model);
        this.loadData();
    }

    loadDataByPageSize($event) {
        this.modelQuery.limit = $event;
        this.modelChange.emit(this.model);
        this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.storeService.getOrders(
            this.store._id,
            this.model
        );
        this.loading = false;
    }
}
