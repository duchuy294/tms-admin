import * as _ from 'lodash';
import { Component, Input, OnChanges } from '@angular/core';
import { CostDetail } from './../../../../../modules/order/models/cost-detail.model';
import { OrderModel } from './../../../../../modules/order/models/order.model';
import { OrderService } from '../../../../../modules/order/services/order.service';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';

@Component({
    selector: 'order-detail-services',
    templateUrl: 'order-detail-services.component.html'
})
export class OrderDetailServicesComponent implements OnChanges {
    @Input() order: OrderModel = new OrderModel();
    @Input() tabIndex: number = 0;
    services: CostDetail[] = [];

    constructor(public orderService: OrderService) { }

    async ngOnChanges() {
        this.services = _.filter(this.order.costDetail[0].children, x => x.style !== ServiceStyle.Promotion);
    }

    getServiceValue(service: CostDetail) {
        switch (service.style) {
            case ServiceStyle.Delivery:
            case ServiceStyle.Delivery_Return:
                return service.distance;

            case ServiceStyle.Delivery_Collection:
                return service.price;

            case ServiceStyle.Installation:
            case ServiceStyle.Installation_AddonService:
            case ServiceStyle.Delivery_Porters:
                return service.quantity;

            default:
                return null;
        }
    }

    getServiceCost(service: CostDetail) {
        if (this.order.userCost === this.order.baseUserCost) {
            return service.value;
        } else {
            return this.tabIndex ? service.baseUserCost : service.userCost;
        }
    }
}
