import { Component, ViewChild } from '@angular/core';
import { WarehouseOrderInformationComponent } from './warehouse-order-information/warehouse-order-information.component';

@Component({
  selector: 'warehouse-detail',
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.less']
})
export class WarehouseDetailComponent {
  @ViewChild('order') order: WarehouseOrderInformationComponent;

  toggleFilter() {
    this.order.toggleFilter();
  }
}
