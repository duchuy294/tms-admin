import { Component, Input } from '@angular/core';

@Component({
  selector: 'warehouse-contact-statistic',
  templateUrl: './warehouse-contact-statistic.component.html',
  styleUrls: ['./warehouse-contact-statistic.component.less']
})
export class WarehouseContactStatisticComponent {
  @Input() data: any;
}
