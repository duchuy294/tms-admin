import { Component, Input, OnInit } from '@angular/core';
import { ISelection } from '../../../../../../modules/utility/models/filter.model';
import { ModalService } from '../../../../../../modules/modal/services/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailService } from '../../../../service/order-detail.service';

@Component({
    selector: 'app-order-skip-marker',
    templateUrl: './order-skip-marker.component.html'
})
export class OrderSkipMarkerComponent implements OnInit {
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
