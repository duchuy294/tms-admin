import * as _ from 'lodash';
import { AccountGroupModel } from './../../../../modules/admin/models/account-group.model';
import { AccountModel } from './../../../../modules/admin/models/admin.model';
import { AdminService } from './../../../../modules/admin/services/admin.service';
import { BranchModel } from './../../../../modules/admin/models/branch.model';
import { BranchService } from './../../../../modules/admin/services/branch.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from './../../../../modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../../models/query.model';
import { Status } from './../../../../constants/status.enum';
@Component({
  selector: 'admins-grid',
  templateUrl: './admins-grid.component.html'
})
export class AdminsGridComponent implements OnInit {
  public groups: { [index: string]: AccountGroupModel } = {};
  public branches: { [index: string]: BranchModel } = {};
  model = new PagingModel<AccountModel>();
  loadingStatus: boolean = false;
  queryModel = new QueryModel({ status: null });
  @Output() delete = new EventEmitter<string>();
  @Output() password = new EventEmitter();
  @Output() modify = new EventEmitter<string>();
  @Output() activate = new EventEmitter();
  loadingGrid = false;
  statuses: { [_id: string]: boolean } = {};
  constructor(
    private service: AdminService,
    private branchService: BranchService
  ) { }

  async ngOnInit() {
    const branchPaging = await this.branchService.filter(new QueryModel({ limit: 1000 }));
    _.forEach(branchPaging.data, branch => {
      this.branches[branch._id] = branch;
    });
    this.getData();
  }

  handleDelete(id: string = null) {
    this.delete.emit(id);
  }

  async getData(pageIndex: number = null) {
    this.loadingGrid = true;
    if (pageIndex) {
      this.queryModel.page = pageIndex;
    }
    this.model = await this.service.getAdmins(this.queryModel);
    const groupPaging = await this.service.getGroupAdmins(new QueryModel({ limit: 1000, fields: 'name', accountIds: _.map(this.model.data, item => item.groupId).join(',') }));
    _.forEach(groupPaging.data, item => {
      this.groups[item._id] = item;
    });

    _.forEach(this.model.data, item => {
      this.statuses[item._id] = item.status === Status.ACTIVE;
    });
    this.loadingGrid = false;
  }

  async loadDataByPage($event: number = 1) {
    this.queryModel.page = $event;
    await this.getData();
  }

  async loadDataByPageSize($event: number = 1) {
    this.queryModel.limit = $event;
    this.queryModel.page = 1;
    await this.getData();
  }

  async triggerLoadData(queryModel: QueryModel = null, pageIndex = 1) {
    if (queryModel) {
      this.queryModel = queryModel;
    }
    await this.getData(pageIndex);
  }

  handlePassword(adminId: string = null) {
    this.password.emit(adminId);
  }

  handleModify(id: string = null) {
    this.modify.emit(id);
  }

  onChangeStatus(id: string = null) {
    this.loadingStatus = true;
    this.activate.emit({ id, active: !this.statuses[id] });
    this.loadingStatus = false;
  }
}