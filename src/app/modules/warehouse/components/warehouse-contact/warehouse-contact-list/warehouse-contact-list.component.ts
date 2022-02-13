import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactStatus } from '@/constants/ContactStatus';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderStatusFilterComponent } from './../../../../utility/components/order-status-filter/order-status-filter.component';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseContactFilterComponent } from './../warehouse-contact-filter/warehouse-contact-filter.component';
import { WarehouseContactGridComponent } from './../warehouse-contact-grid/warehouse-contact-grid.component';
import { WarehouseContactService } from '@/modules/warehouse/services/warehouse-contact.service';

@Component({
  selector: 'warehouse-contact-list',
  templateUrl: './warehouse-contact-list.component.html'
})
export class WarehouseContactListComponent implements OnInit {
  @ViewChild('filter') filter: WarehouseContactFilterComponent;
  @ViewChild('grid') grid: WarehouseContactGridComponent;
  @ViewChild('status') status: OrderStatusFilterComponent;
  query = new QueryModel({});
  filterVisible: boolean = false;
  statisticData: any;
  statusData: any = null;
  statuses = [
    {
      name: 'all',
      value: 0,
      query: new QueryModel({}),
      label: this.translateService.instant('warehouse.contact-status.all'),
    },
    {
      name: `${ContactStatus.WatingToConfirm}`,
      value: 0,
      query: new QueryModel({ status: ContactStatus.WatingToConfirm }),
      label: this.translateService.instant('warehouse.contact-status.1'),
    },
    {
      name: 'completed',
      value: 0,
      query: new QueryModel({ status: [ContactStatus.Completed, ContactStatus.Fail] }),
      label: this.translateService.instant('warehouse.contact-status.completed'),
    }
  ];

  constructor(
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private warehouseContactService: WarehouseContactService,
  ) { }

  async ngOnInit() {
    await this.loadOrderStat();
    await this.loadStatusStat();
  }

  async loadOrderStat(query = null) {
    if (query === null) {
      query = this.query;
    }
    const response = await this.warehouseContactService.getOrderStat(query);
    this.statisticData = response;
  }

  async loadStatusStat() {
    const statusResponse = await this.warehouseContactService.getStatusStat();
    this.statusData = statusResponse;
    this.processStatusStatistic();
  }

  async selectStatus() {
    await this.grid.loadData(this.query);
    await this.loadOrderStat();
    this.filter.reset();
  }

  async process(id: string = null) {
    const response = await this.warehouseContactService.process(id);
    if (response.success) {
      this.messageService.success(this.translateService.instant('common.successfully'));
      this.handleAfterSubmit();
    } else {
      this.messageService.error(this.translateService.instant('common.failed'));
    }
  }

  async search(query: QueryModel) {
    this.grid.triggerLoadData(query);
    await this.loadOrderStat(query);
    this.status.reset();
  }

  async handleAfterSubmit() {
    await this.grid.loadData();
    await this.loadOrderStat();
    await this.loadStatusStat();
  }

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  processStatusStatistic() {
    _.forEach(this.statuses, item => {
      item.value = this.statusData[item.name] || 0;
    });
  }
}
