import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryModel } from '../../../../../models/query.model';
@Component({
    selector: 'servicer-balance-modal',
    templateUrl: 'servicer-balance-modal.component.html',
    styleUrls: ['servicer-balance-modal.component.less']
})
export class ServicerBalanceModalComponent {
    @Input() queryModel = new QueryModel();
    @Input() visible = false;
    @Output() handleVisible = new EventEmitter<boolean>();

    handleVisibleModal(flag: boolean) {
        this.handleVisible.emit(!!flag);
    }
}