import { Component, Input } from '@angular/core';
import { PointModel } from '@/modules/order/models/point.model';

@Component({
    selector: 'warranty-repair-point-more-detail',
    templateUrl: 'warranty-repair-point-more-detail.component.html',
    styleUrls: ['warranty-repair-point-more-detail.component.less']
})
export class WarrantyRepairPointMoreDetailComponent {
    @Input() model: PointModel = new PointModel();
}
