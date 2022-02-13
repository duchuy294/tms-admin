import { AccountGroupModel } from './../../../../../modules/admin/models/account-group.model';
import { AdminService } from './../../../../../modules/admin/services/admin.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from './../../../../../modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../../../models/query.model';

@Component({
  selector: 'grid-group-admin',
  templateUrl: './grid-group-admin.component.html'
})
export class GridGroupAdminComponent implements OnInit {
  model = new PagingModel<AccountGroupModel>();
  queryModel = new QueryModel({ status: null });
  @Output() delete = new EventEmitter<string>();
  @Output() modify = new EventEmitter<string>();
  loadingGrid = false;
  constructor(
    private service: AdminService
  ) { }

  ngOnInit() {
    this.getData();
  }

  async getData(query: QueryModel = null) {
    if (query) {
      this.queryModel = query;
    }
    this.loadingGrid = true;
    this.model = await this.service.getGroupAdmins(this.queryModel);
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

  async triggerLoadData() {
    this.queryModel = new QueryModel({ status: null });
    this.getData();
  }

  handleDelete(id: string = null) {
    this.delete.emit(id);
  }

  handleModify(id: string = null) {
    this.modify.emit(id);
  }
}