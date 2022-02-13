import * as _ from 'lodash';
import { AccountModel } from './../../../../admin/models/admin.model';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FlatLocationModel, LocationLevel } from './../../../../location/components/address/address.model';
import { LocationService } from './../../../../location/services/location.service';
import { PagingModel } from './../../../../utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';


@Component({
    selector: 'district-grid',
    templateUrl: './district-grid.component.html'
})

export class DistrictGridComponent implements OnInit {

    queryModel: QueryModel = new QueryModel();
    public tableData = new PagingModel<FlatLocationModel>();
    loadingGrid: boolean = false;
    adminById: { [_id: string]: AccountModel } = {};
    cityName: { [_id: string]: any } = {};
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();

    constructor(private locationService: LocationService, private adminService: AdminService) {
    }

    async ngOnInit() {
        this.queryModel.name = null;
        await this.loadDistrictList();
    }

    async loadDistrictList(name = null, page = 1) {
        this.queryModel.name = name;
        this.queryModel.page = page;
        this.queryModel.level = LocationLevel.DISTRICT;
        this.loadingGrid = true;
        this.tableData = await this.locationService.filter(this.queryModel);
        const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
        _.forEach(updatedBy, admin => {
            this.adminById[admin._id] = admin;
        });
        const cities = await this.getCities(this.tableData);
        _.forEach(cities, city => {
            this.cityName[city.code] = city.name;
        });
        this.loadingGrid = false;
    }

    async loadDataByPageSize($event) {
        this.queryModel.limit = $event;
        await this.loadDistrictList(this.queryModel.name, 1);
    }

    async loadDataByPage($event) {
        await this.loadDistrictList(this.queryModel.name, $event);
    }

    handleEditAction(districtId) {
        this.edit.emit(districtId);
    }

    handleDeleteAction(districtId) {
        this.delete.emit(districtId);
    }

    async getAdmins(data: PagingModel<FlatLocationModel>, field: string = '') {
        const accountIds = _.map(data.data, response => response[field]).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds }));
        return adminPaging.data;
    }

    async getCities(data: PagingModel<FlatLocationModel>) {
        const parentCode = [];
        _.each(data.data, res => {
            if (res.parentCode) {
                parentCode.push(res.parentCode);
            }
        });

        const response = await this.locationService.filter(new QueryModel({ limit: 100, codes: parentCode ? parentCode.join(',') : '', field: 'name' }));
        return response.data;
    }
}
