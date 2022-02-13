import * as _ from 'lodash';
import { AccountModel } from './../../../../admin/models/admin.model';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FlatLocationModel, LocationLevel } from './../../../../location/components/address/address.model';
import { LocationService } from './../../../../location/services/location.service';
import { PagingModel } from './../../../../utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';


@Component({
    selector: 'wards-grid',
    templateUrl: './wards-grid.component.html'
})

export class WardsGridComponent implements OnInit {

    queryModel: QueryModel = new QueryModel();
    public tableData = new PagingModel<FlatLocationModel>();
    loadingGrid: boolean = false;
    adminById: { [_id: string]: AccountModel } = {};
    districtName: { [_id: string]: any } = {};
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();

    constructor(private locationService: LocationService, private adminService: AdminService) {
    }

    async ngOnInit() {
        this.queryModel.name = null;
        await this.loadWardstList();
    }

    async loadWardstList(name = null, page = 1) {
        this.queryModel.name = name;
        this.queryModel.page = page;
        this.queryModel.level = LocationLevel.WARD;
        this.loadingGrid = true;
        this.tableData = await this.locationService.filter(this.queryModel);
        const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
        _.forEach(updatedBy, admin => {
            this.adminById[admin._id] = admin;
        });
        const districts = await this.getDistricts(this.tableData);
        _.forEach(districts, district => {
            this.districtName[district.code] = district.name;
        });
        this.loadingGrid = false;
    }

    async loadDataByPageSize($event) {
        this.queryModel.limit = $event;
        await this.loadWardstList(this.queryModel.name, 1);
    }

    async loadDataByPage($event) {
        await this.loadWardstList(this.queryModel.name, $event);
    }

    handleEditAction(wardsId) {
        this.edit.emit(wardsId);
    }

    handleDeleteAction(wardsId) {
        this.delete.emit(wardsId);
    }

    async getAdmins(data: PagingModel<FlatLocationModel>, field: string = '') {
        const accountIds = _.map(data.data, response => response[field]).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds }));
        return adminPaging.data;
    }

    async getDistricts(data: PagingModel<FlatLocationModel>) {
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
