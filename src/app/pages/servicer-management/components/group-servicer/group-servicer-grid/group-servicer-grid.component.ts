import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GroupServicer } from './../../../../../modules/servicer/models/group-servicer/group-servicer.model';
import { PagingModel } from './../../../../../modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../../../models/query.model';
import { ServicerService } from './../../../../../modules/servicer/services/servicer.service';

@Component({
  selector: 'group-servicer-grid',
  templateUrl: './group-servicer-grid.component.html'
})

export class GroupServicerGridComponent implements OnInit {
  queryModel = new QueryModel({ fields: 'numberOfOrders' });
  model = new PagingModel<GroupServicer>();
  @Output() modify = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  loadingGrid = false;
  constructor(
    private service: ServicerService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  handleDelete(id: string = null) {
    this.delete.emit(id);
  }

  async loadData(queryModel: QueryModel = null) {
    this.loadingGrid = true;
    if (queryModel) {
      this.queryModel = queryModel;
    }
    this.model = await this.service.getGroupServicers(this.queryModel);
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
}