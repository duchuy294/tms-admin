import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from './../../../../../modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../../../models/query.model';
import { ServicerService } from './../../../../../modules/servicer/services/servicer.service';
import { TeamServicerPage } from './../../../../../modules/servicer/models/team-servicer/team-servicer.model';

@Component({
  selector: 'team-servicer-grid',
  templateUrl: './team-servicer-grid.component.html'
})
export class TeamServicerGridComponent implements OnInit {
  queryModel = new QueryModel({ status: null });
  loadingGrid = false;
  model = new PagingModel<TeamServicerPage>();
  @Output() delete = new EventEmitter<string>();

  constructor(
    private servicer: ServicerService
  ) { }

  async ngOnInit() {
    this.loadData();
  }

  async loadData(pageIndex: number = null) {
    if (pageIndex) {
      this.queryModel.page = pageIndex;
    }
    this.loadingGrid = true;
    this.model = await this.servicer.getTeamServicers(this.queryModel);
    this.loadingGrid = false;
  }

  async triggerLoadData(queryModel: QueryModel = null, pageIndex = 1) {
    if (queryModel) {
      this.queryModel = queryModel;
    }
    await this.loadData(pageIndex);
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

  handleDelete(id: string = null) {
    this.delete.emit(id);
  }
}