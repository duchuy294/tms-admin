import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';
import { WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

@Component({
  selector: 'warehouse-grid',
  templateUrl: './warehouse-grid.component.html',
})
export class WarehouseGridComponent implements OnInit {
  @Output() statistics: EventEmitter<any> = new EventEmitter();
  active = Status.ACTIVE;
  limit = 100;
  loadingGrid: boolean = false;
  public tableData = new PagingModel<WarehouseModel>();
  queryModel: QueryModel = new QueryModel({ status: null });
  typeObject: { [_id: string]: string } = {};

  @Output() delete = new EventEmitter();

  constructor(
    private warehouseService: WarehouseService
  ) { }

  async ngOnInit() {
    await this.getType();
    await this.loadData();
  }

  async getType() {
    const response = await this.warehouseService.filterWarehouseType(new QueryModel({ limit: this.limit }));
    for (const type of response.data) {
      this.typeObject[type._id] = type.name;
    }
  }

  async triggerLoadData(queryModel: QueryModel, pageIndex?) {
    await this.loadData(queryModel, pageIndex);
  }

  async loadData(query = null, page = null, getStat = true) {
    if (query) {
      this.queryModel = new QueryModel(query);
    }
    if (page) {
      this.queryModel.page = page;
    }
    this.queryModel.statistic = getStat;
    this.loadingGrid = true;

    this.tableData = await this.warehouseService.filterWarehouse(this.queryModel);
    const verifyQuery = this.warehouseService.verifyPageQueryModel(this.tableData, this.queryModel);
    if (verifyQuery.error) {
      this.queryModel = verifyQuery.modelQuery;
      this.tableData = await this.warehouseService.filterWarehouse(this.queryModel);
    }

    if (getStat) {
      this.statistics.emit(this.tableData.statistic);
    }

    this.loadingGrid = false;
  }

  async loadDataByPage($event = 1) {
    await this.loadData(null, $event, false);
  }

  async loadDataByPageSize($event = 20) {
    this.queryModel.limit = $event;
    await this.loadData(null, 1, false);
  }

  handleDelete(id: string = null) {
    this.delete.emit(id);
  }

  showType(typeIds) {
    return typeIds.map(type => this.typeObject[type]).join(', ');
  }

  showAddress(address) {
    const arr = [];
    if (address && address.street) {
      arr.push(address.street);
    }
    if (address && address.ward) {
      arr.push(address.ward);
    }
    if (address && address.district) {
      arr.push(address.district);
    }
    if (address && address.city) {
      arr.push(address.city);
    }
    return arr.join(', ');
  }
}
