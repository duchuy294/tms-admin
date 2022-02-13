import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import {
    Component,
    EventEmitter,
    OnInit,
    Output
} from '@angular/core';
import { LocationService } from '@/modules/location/services/location.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ReturnWarehouseModel } from '../../../../delivery/models/return-warehouse.model';
import { ReturnWarehouseService } from '../../../../delivery/services/return-warehouse.service';
import { LocationLevel } from '@/modules/location/components/address/address.model';

@Component({
    selector: 'return-warehouse-grid',
    templateUrl: './return-warehouse-grid.component.html'
})

export class ReturnWarehouseGridComponent implements OnInit {
    queryModel: QueryModel = new QueryModel({ fields: 'name,code,order,createdBy,createdAt,updatedBy,updatedAt,address,mapAdress' });
    loadingGrid: boolean = false;
    adminUpdatedBy: { [_id: string]: AccountModel } = {};
    cityListName: { [code: string]: any } = {};
    districtListName: { [code: string]: any } = {};
    wardsListName: { [code: string]: any } = {};

    public tableData = new PagingModel<ReturnWarehouseModel>();

    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();

    constructor(
        private adminService: AdminService,
        private warehouseService: ReturnWarehouseService,
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
        this.tableData = await this.warehouseService.filter(this.queryModel);
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
            this.wardsListName[ward.code] = ward.name;
        });
        this.loadingGrid = false;
    }

    async loadDataByPage($event) {
        await this.loadData(this.queryModel.cityName, $event);
    }

    async loadDataByPageSize($event) {
        this.queryModel.limit = $event;
        await this.loadData(this.queryModel.cityName, 1);
    }

    handleDelete(warehouseId) {
        this.delete.emit(warehouseId);
    }

    handleEdit(warehouseId) {
        this.edit.emit(warehouseId);
    }

    async getAdmins(data: PagingModel<ReturnWarehouseModel>, field: string = '') {
        const accountIds = _.map(data.data, response => response[field]).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ accountIds }));
        return adminPaging.data;
    }

    async getCities(data: PagingModel<ReturnWarehouseModel>) {
        const codes = _.map(data.data, res => res.address.city).join(',');
        const response = await this.locationService.filter(new QueryModel({ level: LocationLevel.CITY, limit: 500, codes, field: 'name' }));
        return response.data;
    }

    async getDistricts(data: PagingModel<ReturnWarehouseModel>) {
        const codes = _.map(data.data, res => res.address.district).join(',');
        const response = await this.locationService.filter(new QueryModel({ level: LocationLevel.DISTRICT, limit: 500, codes, field: 'name' }));
        return response.data;
    }
    async getWards(data: PagingModel<ReturnWarehouseModel>) {
        const codes = _.map(data.data, res => res.address.ward).join(',');
        const response = await this.locationService.filter(new QueryModel({ level: LocationLevel.WARD, limit: 500, codes, field: 'name' }));
        return response.data;
    }

}
