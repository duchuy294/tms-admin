import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISelection } from '../../../../../../modules/utility/models/filter.model';
import { OrderDetailService } from '../../../../service/order-detail.service';
import { ModalService } from '../../../../../../modules/modal/services/modal.service';

@Component({
    selector: 'order-delete-marker',
    templateUrl: './order-delete-marker.component.html'
})
export class OrderDeleteMarkerComponent implements OnInit {
    @Input() deliveryPoints: ISelection[] = [];
    @Input() orderId: string;
    id: string;
    note?: string;

    constructor(
        private service: OrderDetailService,
        private modalService: ModalService,
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.id = this.deliveryPoints[0]._id;
    }

    async confirm() {
        const response = await this.service.putCancelDeliveryPoint(this.orderId, this.id, this.note);
        this.modalService.info(response.errorCode, true);
        if (response.errorCode === 0) {
            this.activeModal.close();
            window.location.reload();
        }
    }
}
