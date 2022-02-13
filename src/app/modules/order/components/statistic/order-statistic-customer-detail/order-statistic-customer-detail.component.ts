import { Component, Input } from '@angular/core';
import { OrderStatisticModel } from '@/modules/order/models/order-statistic.model';

@Component({
    selector: 'order-statistic-customer-detail',
    templateUrl: './order-statistic-customer-detail.component.html',
    styleUrls: ['./order-statistic-customer-detail.component.less']
})
export class OrderStatisticCustomerDetailComponent {
    @Input() data = new OrderStatisticModel();
}
