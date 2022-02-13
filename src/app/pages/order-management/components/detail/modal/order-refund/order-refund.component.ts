import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'order-refund',
    templateUrl: './order-refund.component.html'
})
export class OrderRefundComponent {
    constructor(public activeModal: NgbActiveModal) { }
}
