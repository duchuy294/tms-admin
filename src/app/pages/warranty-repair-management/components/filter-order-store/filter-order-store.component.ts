import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderStoreQueryModel } from '@/modules/warranty-repair/models/order-store-query.model';

@Component({
    selector: 'filter-order-store',
    templateUrl: './filter-order-store.component.html'
})
export class FilterOrderStoreComponent {
    modelQuery: OrderStoreQueryModel = new OrderStoreQueryModel();
    @Output() modelChange = new EventEmitter();
    @Output() onSearch = new EventEmitter();
    @Output() onReset = new EventEmitter();
    status = [
        OrderStatus.Accepted,
        OrderStatus.CanceledByUser,
        OrderStatus.InProgress,
        OrderStatus.Finished,
        OrderStatus.Return,
        OrderStatus.WatingToConfirm
    ];

    reset() {
        this.modelQuery = new OrderStoreQueryModel();
        this.modelChange.emit(this.modelQuery);
        setTimeout(() => {
            this.onReset.emit();
        }, 100);
    }

    search() {
        this.modelChange.emit(this.modelQuery);
        this.onSearch.emit();
    }

    @Input()
    set model(value: any) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }
}
