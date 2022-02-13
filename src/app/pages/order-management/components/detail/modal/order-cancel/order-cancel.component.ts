import { Component, Input } from '@angular/core';
import { ModalService } from './../../../../../../modules/modal/services/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailService } from './../../../../service/order-detail.service';

@Component({
    selector: 'order-cancel',
    templateUrl: './order-cancel.component.html'
})
export class OrderCancelComponent {
    @Input() id: string;
    public reason: string;

    constructor(
        private service: OrderDetailService,
        private modalService: ModalService,
        public activeModal: NgbActiveModal
    ) { }

    async confirm() {
        const response = await this.service.deleteOrder(this.id);
        this.modalService.info(response.errorCode, true);
        if (response.errorCode === 0) {
            window.location.reload();
        }
    }
}
