import { Component, Input } from '@angular/core';

@Component({
    selector: 'warehouse-order-statistic',
    templateUrl: './warehouse-order-statistic.component.html',
    styleUrls: ['./warehouse-order-statistic.component.less']
})
export class WarehouseOrderStatisticComponent {
    @Input() data: any;
}