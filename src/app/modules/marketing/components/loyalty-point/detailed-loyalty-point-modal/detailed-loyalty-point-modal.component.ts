import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'detailed-loyalty-point-modal',
    templateUrl: './detailed-loyalty-point-modal.component.html'
})
export class DetailedLoyaltyPointModalComponent {
    @Input() visible: boolean = false;
    @Input() data: any;
    @Output() handleVisible = new EventEmitter<boolean>();

    onCancelModal() {
        this.handleVisibleModal(false);
    }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

}
