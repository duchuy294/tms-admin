import * as _ from 'lodash';
import { FlatLocationModel } from '@/modules/location/components/address/address.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { Direction } from '@/constants/Direction';
import { LocationService } from '@/modules/location/services/location.service';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';
import { WarehouseServiceModel } from '@/modules/warehouse/models/warehouseService.model';

@Component({
    selector: 'warehouse-filter',
    templateUrl: './warehouse-filter.component.html'
})
export class WarehouseFilterComponent implements OnInit {
    @Output() search: EventEmitter<QueryModel> = new EventEmitter<QueryModel>();
    baseQueryModel: QueryModel = new QueryModel({ statistic: true, status: null });
    limit = 100;
    cities: FlatLocationModel[] = [];
    directionList = [];
    districts: FlatLocationModel[] = [];
    serviceList: WarehouseServiceModel[] = [];
    statusList = [Status.NEW, Status.ACTIVE, Status.SUSPENDED, Status.DELETED];
    typeList = [];
    ranges = {
        Today: [new Date(), new Date()]
    };
    _createdAt: Date[];
    model: QueryModel = new QueryModel(this.baseQueryModel);

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        if (_.isEmpty(value)) {
            delete this.model.startTime;
            delete this.model.endTime;
        } else {
            this.model.startTime = DateTimeService.convertDateToTimestamp(value[0], null);
            this.model.endTime = DateTimeService.convertDateToTimestamp(value[1], null, true);
        }
        this._createdAt = value;
    }

    get availableArea() {
        return this.model.availableArea;
    }

    set availableArea(value) {
        this.model.availableArea = parseInt(value);
    }

    constructor(
        private locationService: LocationService,
        private warehouseService: WarehouseService
    ) { }

    async ngOnInit() {
        await this.getCities();
        await this.getServices();
        await this.getType();
        for (const item in Direction) {
            if (Direction.hasOwnProperty(item)) {
                this.directionList.push(Direction[item]);
            }
        }
    }

    async getCities() {
        const response = await this.locationService.filter(new QueryModel({ level: 2, limit: this.limit }));
        this.cities = response.data;
    }

    async getDistricts(code: string = null) {
        const response = await this.locationService.filter(new QueryModel({ limit: this.limit, parentCode: `${code}` }));
        this.districts = response.data;
    }

    async getServices() {
        const response = await this.warehouseService.filterService(new QueryModel({ limit: this.limit, status: Status.ACTIVE }));
        this.serviceList = response.data;
    }

    async getType() {
        const response = await this.warehouseService.filterWarehouseType(new QueryModel({ limit: this.limit }));
        this.typeList = response.data;
    }

    async onCityChange($event) {
        await this.getDistricts($event.code);
        this.model.city = $event.code;
    }

    searchFilter() {
        this.search.emit(this.model);
    }

    resetFilter() {
        this.model = new QueryModel(this.baseQueryModel);
        this.searchFilter();
    }
}
