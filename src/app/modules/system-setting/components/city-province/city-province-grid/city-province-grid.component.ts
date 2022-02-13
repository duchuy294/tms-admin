import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { FlatLocationModel, LocationLevel } from '@/modules/location/components/address/address.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocationService } from '@/modules/location/services/location.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'city-province-grid',
    templateUrl: './city-province-grid.component.html'
})
export class CityProvinceGridComponent implements OnInit {
    queryModel: QueryModel = new QueryModel();
    loadingGrid: boolean = false;
    adminUpdatedBy: { [_id: string]: AccountModel } = {};
    public tableData = new PagingModel<FlatLocationModel>();
    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();

    constructor(
        private adminService: AdminService,
        private locationService: LocationService,
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData(name = null, page = 1) {
        this.queryModel.name = name;
        this.queryModel.page = page;
        this.queryModel.level = LocationLevel.CITY;
        this.loadingGrid = true;
        this.tableData = await this.locationService.filter(this.queryModel);
        const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
        _.forEach(updatedBy, admin => {
            this.adminUpdatedBy[admin._id] = admin;
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

    handleDelete(cityId) {
        this.delete.emit(cityId);
    }

    handleEdit(cityId) {
        this.edit.emit(cityId);
    }

    async getAdmins(data: PagingModel<FlatLocationModel>, field: string = '') {
        const accountIds = _.map(data.data, response => response[field]).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds }));
        return adminPaging.data;
    }
}
