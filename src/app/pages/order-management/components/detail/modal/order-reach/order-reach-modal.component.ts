import * as _ from 'lodash';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModel } from 'app/modules/order/models/order.model';
import { OrderService } from 'app/modules/order/services/order.service';
import { PagingModel } from './../../../../../../modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { Servicer } from 'app/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';

@Component({
    selector: 'order-reach-modal',
    templateUrl: './order-reach-modal.component.html'
})
export class OrderReachModalComponent implements OnChanges, OnInit {
    @Input() order: OrderModel;
    servicers = new PagingModel<Servicer>();
    loading = false;
    constructor(
        public activeModal: NgbActiveModal,
        public orderService: OrderService,
        public servicerService: ServicerService
    ) { }

    async ngOnInit() {
        await this.update();
    }

    async ngOnChanges() {
        await this.update();
    }

    async update() {
        this.loading = true;
        const reach = await this.orderService.getReach(this.order._id);
        let servicerIds = [];
        if (reach) {
            servicerIds = reach.summary;
            _.forEach(Object.keys(reach.staffs), key => {
                servicerIds.push(key);
                servicerIds.push(...reach.staffs[key]);
            });
        }

        this.servicers = reach ? (await this.servicerService.getServicers(new QueryModel({ servicerIds: _.join(servicerIds, ','), limit: 1000 }))) : null;
        this.loading = false;
    }
}
