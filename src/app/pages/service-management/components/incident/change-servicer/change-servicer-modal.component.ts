import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModel } from '../../../../../modules/order/models/order.model';
import { OrderService } from './../../../../../modules/order/services/order.service';

@Component({
    selector: 'change-servicer-modal',
    templateUrl: './change-servicer-modal.component.html'
})
export class ChangeServicerModalComponent {
    order: OrderModel = new OrderModel();
    maxMoney: number = 0;
    money: number = 0;
    completed: () => void;
    get errorParams() {
        return { maxMoney: this.maxMoney.toLocaleString() };
    }

    constructor(
        public activeModal: NgbActiveModal,
        public orderService: OrderService
    ) { }

    public async confirm() {
        const result = await this.orderService.payCollection(this.order._id, this.money);
        if (result) {
            this.activeModal.close();
            if (this.completed) {
                await this.completed();
            }
        }
    }
}
