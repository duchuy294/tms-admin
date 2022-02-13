import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from './../../../../../utility/components/paging/paging.model';
import { QueryModel } from './../../../../../../models/query.model';
import { RewardProviderModel } from './../../../../models/reward-provider.model';
import { RewardProviderService } from './../../../../services/reward-provider.service';

@Component({
  selector: 'reward-provider-grid',
  templateUrl: './reward-provider-grid.component.html'
})
export class RewardProviderGridComponent implements OnInit {
  queryModel = new QueryModel({ status: null });
  loadingGrid = false;
  model = new PagingModel<RewardProviderModel>();
  @Output() delete = new EventEmitter<RewardProviderModel>();
  @Output() view = new EventEmitter<RewardProviderModel>();
  @Output() edit = new EventEmitter<string>();
  constructor(
    private service: RewardProviderService) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData(queryModel: QueryModel = null) {
    if (queryModel) {
      this.queryModel = queryModel;
    }
    this.loadingGrid = true;
    this.model = await this.service.filter(this.queryModel);
    this.loadingGrid = false;
  }

  async loadDataByPage($event: number = 1) {
    this.queryModel.page = $event;
    await this.loadData();
  }

  async loadDataByPageSize($event: number = 1) {
    this.queryModel.limit = $event;
    this.queryModel.page = 1;
    await this.loadData();
  }

  handleDelete(model: RewardProviderModel = null) {
    this.delete.emit(model);
  }

  handleView(model: RewardProviderModel = null) {
    this.view.emit(model);
  }

  handleEdit(id: string = null) {
    this.edit.emit(id);
  }
}