import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'transaction-grid-modal',
    templateUrl: './transaction-grid-modal.component.html',
    styleUrls: ['./transaction-grid-modal.component.less']
})
export class TransactionGridModalComponent {
    @Input() queryModel = new QueryModel();
    @Input() visible = false;
    @Output() handleVisible = new EventEmitter<boolean>();

    handleVisibleModal(flag: boolean) {
        this.handleVisible.emit(!!flag);
    }
}