import * as _ from 'lodash';
import { ActivityModel } from './../../../../modules/activity/models/activity.model';
import { ActivityService } from './../../../../modules/activity/services/activity.service';
import { Component, Input, OnInit } from '@angular/core';
import { OrderModel } from 'app/modules/order/models/order.model';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.less']
})
export class OrderHistoryComponent implements OnInit {
    @Input() order: OrderModel;
    @Input() hideTitle: boolean;
    @Input() linebreak: boolean;
    public actions: ActivityModel[] = [];

    constructor(private activityService: ActivityService) {}

    async ngOnInit() {
        const paging = await this.activityService.filter(
            new QueryModel({ limit: 1000, orderId: this.order._id })
        );
        this.actions = paging.data.reverse();
    }
}
