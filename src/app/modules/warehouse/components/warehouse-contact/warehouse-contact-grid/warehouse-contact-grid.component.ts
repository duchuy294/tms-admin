import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CONTACT_STATUS_COLOR } from '@/constants/ContactStatus';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { WarehouseContactModel } from '@/modules/warehouse/models/warehouse-contact.model';
import { WarehouseContactService } from '@/modules/warehouse/services/warehouse-contact.service';
import { WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

@Component({
  selector: 'warehouse-contact-grid',
  templateUrl: './warehouse-contact-grid.component.html',
  styleUrls: ['./warehouse-contact-grid.component.less']
})
export class WarehouseContactGridComponent implements OnInit {
  @Output() process: EventEmitter<any> = new EventEmitter();
  CONTACT_STATUS_COLOR = CONTACT_STATUS_COLOR;
  loadingGrid: boolean = false;
  public tableData = new PagingModel<WarehouseContactModel>();
  queryModel: QueryModel = new QueryModel({ status: null });
  admin: { [_id: string]: AccountModel } = {};
  customer: { [_id: string]: Customer } = {};
  warehouse: { [_id: string]: WarehouseModel } = {};

  constructor(
    private adminService: AdminService,
    private customerService: CustomerService,
    private warehouseContactService: WarehouseContactService,
    private warehouseService: WarehouseService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async triggerLoadData(queryModel: QueryModel, pageIndex = 1) {
    await this.loadData(queryModel, pageIndex);
  }

  async loadData(query = null, page = null) {
    if (query) {
      this.queryModel = new QueryModel(query);
    }
    if (page) {
      this.queryModel.page = page;
    }
    this.loadingGrid = true;

    this.tableData = await this.warehouseContactService.filter(this.queryModel);
    const verifyQuery = this.warehouseContactService.verifyPageQueryModel(this.tableData, this.queryModel);
    if (verifyQuery.error) {
      this.queryModel = verifyQuery.modelQuery;
      this.tableData = await this.warehouseContactService.filter(this.queryModel);
    }

    if (this.tableData.data.length) {
      await this.getAdmins(this.tableData);
      await this.getCustomers(this.tableData);
      await this.getWarehouses(this.tableData);
    }

    this.loadingGrid = false;
  }

  async loadDataByPage($event = 1) {
    await this.loadData(null, $event);
  }

  async loadDataByPageSize($event = 20) {
    this.queryModel.limit = $event;
    await this.loadData(null, 1);
  }

  async getAdmins(data: PagingModel<WarehouseContactModel>) {
    const accountIds = _.uniq(_.map(data.data, item => item.processedBy).filter(item => item && !this.admin[item])).join(',');
    if (accountIds) {
      const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: this.queryModel.limit, accountIds }));
      _.forEach(adminPaging.data, item => {
        this.admin[item._id] = item;
      });
    }
  }

  async getCustomers(data: PagingModel<WarehouseContactModel>) {
    const userIds = _.uniq(_.map(data.data, item => item.userId).filter(item => item && !this.customer[item])).join(',');
    if (userIds) {
      const userPaging = await this.customerService.getCustomers(new QueryModel({ limit: this.queryModel.limit, userIds }));
      _.forEach(userPaging.data, item => {
        this.customer[item._id] = item;
      });
    }
  }

  async getWarehouses(data: PagingModel<WarehouseContactModel>) {
    const warehouseIds = _.uniq(_.map(data.data, item => item.warehouseId).filter(item => item && !this.warehouse[item])).join(',');
    if (warehouseIds) {
      const warehousePaging = await this.warehouseService.filterWarehouse(new QueryModel({ limit: this.queryModel.limit, warehouseId: warehouseIds }));
      _.forEach(warehousePaging.data, item => {
        this.warehouse[item._id] = item;
      });
    }
  }

  onProcess(id: string = null) {
    this.process.emit(id);
  }
}
