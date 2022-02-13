import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';
import { WarehouseService } from '../../../services/warehouse.service';
import { WarehouseTimelineModel } from '../../../models/warehouseTimeline.model';

@Component({
  selector: 'warehouse-timeline-grid',
  templateUrl: './warehouse-timeline-grid.component.html',
})
export class WarehouseTimelineGridComponent implements OnInit {
  loadingGrid: boolean = false;
  loadingStatus: boolean = false;
  public tableData = new PagingModel<WarehouseTimelineModel>();
  queryModel: QueryModel = new QueryModel({ page: 1, status: `${Status.NEW},${Status.ACTIVE}` });
  statuses: { [_id: string]: boolean } = {};

  @Output() activate = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();

  constructor(
    private warehouseService: WarehouseService
  ) { }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData(page = null) {
    if (page) {
      this.queryModel.page = page;
    }
    this.loadingGrid = true;
    this.tableData = await this.warehouseService.filterTimeline(this.queryModel);

    const verifyQuery = this.warehouseService.verifyPageQueryModel(this.tableData, this.queryModel);
    if (verifyQuery.error) {
      this.queryModel = verifyQuery.modelQuery;
      this.tableData = await this.warehouseService.filterTimeline(this.queryModel);
    }

    _.forEach(this.tableData.data, item => {
      this.statuses[item._id] = item.status === Status.ACTIVE;
    });
    this.loadingGrid = false;
  }

  async loadDataByPage($event = 1) {
    await this.loadData($event);
  }

  async loadDataByPageSize($event = 20) {
    this.queryModel.limit = $event;
    await this.loadData(1);
  }

  handleDelete(id: string = null) {
    this.delete.emit(id);
  }

  handleEdit(id: string = null) {
    this.edit.emit(id);
  }

  onChangeStatus(id: string = null) {
    this.loadingStatus = true;
    this.activate.emit({ id, active: !this.statuses[id] });
    this.loadingStatus = false;
  }
}
