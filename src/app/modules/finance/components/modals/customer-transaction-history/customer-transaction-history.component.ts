import * as _ from 'lodash';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'customer-transaction-history',
    templateUrl: './customer-transaction-history.component.html',
    styleUrls: ['./customer-transaction-history.component.less']
})

export class CustomerTransactionHistoryComponent {
    visibleModal: boolean = false;
    customerIds: string[] = [];

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }

    @Input()
    set userIds(value) {
        this.customerIds = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    handleVisibleModal(flag: boolean) {
        this.handleVisible.emit(!!flag);
    }
}