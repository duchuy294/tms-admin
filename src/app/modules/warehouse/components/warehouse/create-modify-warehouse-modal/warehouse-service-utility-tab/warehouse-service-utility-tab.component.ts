import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { Direction } from '@/constants/Direction';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseDetailPriceByTimeline, WarehouseDetailServiceModel, WarehouseDetailSize, WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';
@Component({
    selector: 'warehouse-service-utility-tab',
    templateUrl: './warehouse-service-utility-tab.component.html',
    styleUrls: ['./warehouse-service-utility-tab.component.less']
})

export class WarehouseServiceUtilityTabComponent implements OnChanges {
    @Input() model: WarehouseModel = new WarehouseModel();
    @Output() handleSubmit = new EventEmitter();
    @ViewChild('form') form: NgForm;

    showManagerExplain: boolean = false;
    isLoading: boolean = false;
    numberMask = createNumberMask({ prefix: '' });
    directions = [
        Direction.EAST,
        Direction.WEST,
        Direction.SOUTH,
        Direction.NORTH,
        Direction.SOUTHEAST,
        Direction.NORTHEAST,
        Direction.SOUTHWEST,
        Direction.NORTHWEST
    ];
    utilities = [];
    services = [];
    priceByTimelines = [];
    modelServices: { [_id: string]: { price: number, checked: boolean } } = {};
    modelPriceByTimelines: { [_id: string]: { price: number, checked: boolean } } = {};
    managerCode = '';
    staffCode = '';
    sizeWidth = null;
    sizeLength = null;
    maxMeasurement = 20000;
    maxServicePrice = 100000000;
    maxPrice = 5000000;

    public managerData: Customer[] = [];
    public staffData: Customer[] = [];

    constructor(
        private warehouseService: WarehouseService,
        private customerService: CustomerService,
        private translateService: TranslateService,
        private messageService: NzMessageService
    ) { }

    ngOnChanges() {
        this.isLoading = true;
        this.loadData();
        this.isLoading = false;
    }

    onDirectionChanges(value: string[]): void {
        this.model.directions = value;
    }

    onUtilityChanges(value: string[]): void {
        this.model.utilityIds = value;
    }

    onServiceChecboxChanges(value, id): void {
        this.modelServices[id].checked = value;
    }

    onPriceChecboxChanges(value, id): void {
        this.modelPriceByTimelines[id].checked = value;
    }

    async loadData() {
        this.loadSize();
        await this.loadUtilities();
        await this.loadServices();
        await this.loadPriceByTimelines();
        await this.loadManagers();
        await this.loadStaffs();
    }

    loadSize() {
        if (this.model && this.model.size) {
            this.sizeWidth = this.model.size.width || null;
            this.sizeLength = this.model.size.height || null;
        }
    }

    async loadUtilities() {
        this.utilities = (await this.warehouseService.filterUtility(new QueryModel({ status: Status.ACTIVE, limit: 1000 }))).data;
    }

    async loadServices() {
        this.services = (await this.warehouseService.filterService(new QueryModel({ status: Status.ACTIVE, limit: 1000 }))).data;
        _.forEach(this.services, item => {
            this.modelServices[item._id] = { price: 0, checked: false };
        });
        _.forEach(this.model.services, item => {
            if (this.modelServices[item.serviceId]) {
                this.modelServices[item.serviceId] = { price: item.price, checked: true };
            }
        });
    }

    async loadPriceByTimelines() {
        this.priceByTimelines = (await this.warehouseService.filterTimeline(new QueryModel({ status: Status.ACTIVE, limit: 1000 }))).data;
        _.forEach(this.priceByTimelines, item => {
            this.modelPriceByTimelines[item._id] = { price: 0, checked: false };
        });
        _.forEach(this.model.priceByTimelines, item => {
            if (this.modelPriceByTimelines[item.pricingTimelineId]) {
                this.modelPriceByTimelines[item.pricingTimelineId] = { price: item.price, checked: true };
            }
        });
    }

    async loadManagers() {
        if (this.model && this.model.userId) {
            const customer = await this.customerService.getCustomer(this.model.userId);
            this.managerData = [customer];
        }
    }

    async addManager() {
        if (this.managerCode) {
            if (this.managerData.length) {
                this.messageService.error(this.translateService.instant('warehouse.warehouse-service-utility.validation-unique-manager'));
            } else {
                this.managerData = (await this.customerService.getCustomers(new QueryModel({ limit: 1, exactCode: this.managerCode }))).data;
            }
            this.managerCode = '';
        }
    }

    deleteManager() {
        this.managerData = [];
    }

    async loadStaffs() {
        if (this.model && !_.isEmpty(this.model.staffIds)) {
            const customerPaging = await this.customerService.getCustomers(new QueryModel({
                limit: this.model.staffIds.length,
                userIds: this.model.staffIds
            }));
            this.staffData = customerPaging.data;
        }
    }

    async addStaff() {
        if (this.staffCode) {
            const customerPaging = await this.customerService.getCustomers(new QueryModel({ limit: 1, exactCode: this.staffCode }));
            if (customerPaging.total) {
                this.staffData.push(customerPaging.data[0]);
                this.staffData = _.uniqBy(this.staffData, '_id');
            }
            this.staffCode = '';
        }
    }

    deleteStaff(id) {
        this.staffData = _.filter(this.staffData, item => item._id !== id);
    }

    submit() {
        this.convertData();
        this.handleSubmit.emit({
            model: this.model,
            fields: 'serviceUtilityFields'
        });
    }

    convertData() {
        const validServices = [];
        for (const key in this.modelServices) {
            if (this.modelServices.hasOwnProperty(key)) {
                if (this.modelServices[key].checked) {
                    validServices.push(new WarehouseDetailServiceModel({
                        serviceId: key,
                        price: this.toNumber(this.modelServices[key].price)
                    }));
                }
            }
        }
        this.model.services = validServices;

        const validPriceByTimelines = [];
        for (const key in this.modelPriceByTimelines) {
            if (this.modelPriceByTimelines.hasOwnProperty(key)) {
                if (this.modelPriceByTimelines[key].checked) {
                    validPriceByTimelines.push(new WarehouseDetailPriceByTimeline({
                        pricingTimelineId: key,
                        price: this.toNumber(this.modelPriceByTimelines[key].price) || null
                    }));
                }
            }
        }
        this.model.priceByTimelines = validPriceByTimelines;
        this.model.price = this.toNumber(this.model.price);
        if (this.sizeLength && this.sizeWidth) {
            this.model.size = new WarehouseDetailSize({ height: this.sizeLength, width: this.sizeWidth });
        } else {
            this.model.size = new WarehouseDetailSize({ height: null, width: null });
        }
        this.model.userId = (this.managerData[0]) ? this.managerData[0]._id : '';
        this.model.staffIds = _.map(this.staffData, item => item._id);
    }

    valid() {
        this.showManagerExplain = !this.managerData.length;
        return this.inRange(this.model.area, 1, this.maxMeasurement)
            && this.inRange(this.model.availableArea, 1, this.maxMeasurement)
            && !this.validateArea()
            && this.validateSize()
            && this.validateServices()
            && this.inRange(this.model.price, 0, this.maxPrice)
            && this.validatePriceByTimelines()
            && this.managerData.length
            && this.form.valid;
    }

    validateForm() {
        CommonHelper.validateForm(this.form);
    }

    validatePrice(value) {
        return _.isEmpty(value);
    }

    validateArea() {
        return this.toNumber(this.model.availableArea) > this.toNumber(this.model.area);
    }

    validateSize() {
        return (_.isNull(this.model.size.width) && _.isNull(this.model.size.height))
            || ((this.model.size.width && this.inRange(this.model.size.width, 1, this.maxMeasurement))
                && (this.model.size.height && this.inRange(this.model.size.height, 1, this.maxMeasurement)));
    }

    validateServices() {
        return _.isEmpty(_.filter(this.model.services, item => !this.inRange(item.price, 0, this.maxServicePrice)));
    }

    validatePriceByTimelines() {
        return _.isEmpty(_.filter(this.model.priceByTimelines, item => !this.inRange(item.price, 0, this.maxPrice)));
    }

    reset() {
        CommonHelper.resetForm(this.form);
    }

    toNumber(value) {
        return value ? CommonHelper.parseS2N(value) : 0;
    }

    inRange(value, min: number, max: number, equal = true) {
        if (_.isEmpty(value) && !_.isNumber(value)) {
            return true;
        }
        return (equal ? this.toNumber(value) >= min : this.toNumber(value) > min) && this.toNumber(value) <= max;
    }
}