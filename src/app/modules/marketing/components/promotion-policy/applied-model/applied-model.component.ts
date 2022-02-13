import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'applied-model',
    templateUrl: './applied-model.component.html'
})
export class AppliedModelComponent implements OnChanges {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() promotionCode = '';
    loading: boolean = false;
    queryModel = new QueryModel({ fields: '_id,code,discountAmount,createdAt' });
    tableData: PagingModel<OrderModel> = new PagingModel<OrderModel>();
    orderDataCache: any = {};

    constructor(
        private orderService: OrderService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.visible
            && changes.visible.currentValue
            && !changes.visible.previousValue
            && this.promotionCode) {
            this.queryModel.promotionCode = this.promotionCode;
            this.loadData();
        }

    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.orderService.getOrders(this.queryModel);
        this.loading = false;
    }

    loadDataByPage($event) {
        this.queryModel.page = $event;
        this.loadData();
    }

    loadDataByPageSize($event) {
        this.queryModel.limit = $event;
        this.loadData();
    }

    handleVisibleModal() {
        this.visibleChange.emit(false);
        this.onReset();
    }

    onReset() {
        this.tableData = new PagingModel<OrderModel>();
    }

}
