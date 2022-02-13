import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { BranchModel } from '@/modules/admin/models/branch.model';
import { BranchService } from '@/modules/admin/services/branch.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocationService } from '@/modules/location/services/location.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Component({
  selector: 'adidi-branch-grid',
  templateUrl: './adidi-branch-grid.component.html'
})
export class AdidiBranchGridComponent implements OnInit {
  queryModel: QueryModel = new QueryModel({ field: 'name,code,order,createdBy,createdAt,updatedBy,updatedAt,address' });
  loadingGrid: boolean = false;
  adminUpdatedBy: { [_id: string]: AccountModel } = {};
  cityListName: { [_id: string]: any } = {};
  districtListName: { [_id: string]: any } = {};
  public tableData = new PagingModel<BranchModel>();

  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();

  constructor(
    private adminService: AdminService,
    private branchService: BranchService,
    private locationService: LocationService,
  ) { }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData(name = null, page = 1) {
    this.queryModel.page = page;

    name = (name) ? name.trim() : name;
    if (!name || _.isEmpty(name)) {
      this.queryModel.name = null;
    } else {
      this.queryModel.name = name;
    }

    this.loadingGrid = true;
    this.tableData = await this.branchService.filterBranch(this.queryModel);
    const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
    _.forEach(updatedBy, admin => {
      this.adminUpdatedBy[admin._id] = admin;
    });
    const cities = await this.getCities(this.tableData);
    _.forEach(cities, city => {
      this.cityListName[city.code] = city.name;
    });
    const districts = await this.getDistricts(this.tableData);
    _.forEach(districts, district => {
      this.districtListName[district.code] = district.name;
    });
    const wards = await this.getWards(this.tableData);
    _.forEach(wards, ward => {
      this.districtListName[ward.code] = ward.name;
    });
    this.loadingGrid = false;
  }

  async loadDataByPage($event) {
    await this.loadData(this.queryModel.name, $event);
  }

  async loadDataByPageSize($event) {
    this.queryModel.limit = $event;
    await this.loadData(this.queryModel.name, 1);
  }

  handleDelete(branchId) {
    this.delete.emit(branchId);
  }

  handleEdit(branchId) {
    this.edit.emit(branchId);
  }

  async getAdmins(data: PagingModel<BranchModel>, field: string = '') {
    const accountIds = _.map(data.data, response => response[field]).join(',');
    const adminPaging = await this.adminService.getAdmins(new QueryModel({ accountIds }));
    return adminPaging.data;
  }

  async getCities(data: PagingModel<BranchModel>) {
    const codes = _.map(data.data, res => res.address.cityId).join(',');
    const response = await this.locationService.filter(new QueryModel({ limit: 100, codes, field: 'name' }));
    return response.data;
  }

  async getDistricts(data: PagingModel<BranchModel>) {
    const codes = _.map(data.data, res => res.address.district).join(',');
    const response = await this.locationService.filter(new QueryModel({ limit: 500, codes, field: 'name' }));
    return response.data;
  }

  async getWards(data: PagingModel<BranchModel>) {
    const codes = _.map(data.data, res => res.address.ward).join(',');
    const response = await this.locationService.filter(new QueryModel({ limit: 500, codes, field: 'name' }));
    return response.data;
  }
}
