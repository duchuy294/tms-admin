import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { ProviderModel } from '../../models/provider.model';
import { ProviderService } from '../../services/provider.service';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';

@Component({
  selector: 'provider-grid',
  templateUrl: './provider-grid.component.html'
})
export class ProviderGridComponent implements OnInit {
  @Output() activate = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() password = new EventEmitter<string>();
  adminUpdatedBy: { [_id: string]: AccountModel } = {};
  loadingGrid: boolean = false;
  loadingStatus: boolean = false;
  tableData = new PagingModel<ProviderModel>();
  queryModel: QueryModel = new QueryModel();
  statuses: { [_id: string]: boolean } = {};

  constructor(
    private adminService: AdminService,
    private providerService: ProviderService
  ) { }

  async ngOnInit() {
    await this.loadData();
  }

  async triggerLoadData(queryModel: QueryModel, pageIndex?) {
    await this.loadData(queryModel, pageIndex);
  }

  async loadData(query = null, page = 1) {
    if (query) {
      this.queryModel = new QueryModel(query);
    }
    this.queryModel.page = page;
    this.loadingGrid = true;
    this.tableData = await this.providerService.filter(this.queryModel);
    const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
    _.forEach(updatedBy, admin => {
      this.adminUpdatedBy[admin._id] = admin;
    });
    _.forEach(this.tableData.data, provider => {
      this.statuses[provider._id] = (provider.status === Status.ACTIVE);
    });
    this.loadingGrid = false;
  }

  async loadDataByPage($event) {
    await this.loadData(null, $event);
  }

  async loadDataByPageSize($event) {
    this.queryModel.limit = $event;
    await this.loadData(null, 1);
  }

  async getAdmins(data: PagingModel<ProviderModel>, field: string = '') {
    const accountIds = _.map(data.data, response => response[field]).join(',');
    const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds }));
    return adminPaging.data;
  }

  onClickDelete(providerId: string) {
    this.delete.emit(providerId);
  }

  onClickEdit(providerId: string) {
    this.edit.emit(providerId);
  }

  onClickChangePassword(providerId: string) {
    this.password.emit(providerId);
  }

  onChangeStatus(providerId) {
    this.loadingStatus = true;
    this.activate.emit({ providerId, active: !this.statuses[providerId] });
    this.loadingStatus = false;
  }
}
