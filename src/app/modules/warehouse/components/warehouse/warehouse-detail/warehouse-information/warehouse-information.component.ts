import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

@Component({
    selector: 'warehouse-information',
    templateUrl: './warehouse-information.component.html',
    styleUrls: ['./warehouse-information.component.less']
})

export class WarehouseInformationComponent implements OnInit {
    id = this.route.snapshot.paramMap.get('id');
    model: WarehouseModel;
    modalVisible: boolean = false;
    areaVisible: boolean = false;
    services = [];
    utilities = [];
    warehouseTypes = [];
    manager: Customer;
    directions = '';
    loading = false;

    constructor(
        private warehouseService: WarehouseService,
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private translateService: TranslateService
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.model = await this.warehouseService.getWarehouse(this.id);

        if (this.model) {
            await this.getServices();
            await this.getUtilities();
            await this.getWarehouseTypes();
            await this.getManager();
            this.getDirections();
        }
        this.loading = false;
    }

    async getServices() {
        if (!_.isEmpty(this.model.services)) {
            const services = await this.warehouseService.filterService(new QueryModel({
                serviceId: _.map(this.model.services, item => item.serviceId).join(','),
                fields: 'name'
            }));
            this.services = services.data;
        } else {
            this.services = [];
        }
    }

    async getUtilities() {
        if (!_.isEmpty(this.model.utilityIds)) {
            const utilities = await this.warehouseService.filterUtility(new QueryModel({
                utilityId: this.model.utilityIds,
                fields: 'name'
            }));
            this.utilities = utilities.data;
        } else {
            this.utilities = [];
        }
    }

    async getWarehouseTypes() {
        const warehouseTypes = await this.warehouseService.filterWarehouseType(new QueryModel({
            warehouseTypeId: this.model.typeIds,
            fields: 'name'
        }));
        this.warehouseTypes = warehouseTypes.data;
    }

    async getManager() {
        if (this.model.userId) {
            const manager = await this.customerService.getCustomer(this.model.userId);
            this.manager = manager;
        }
    }

    getDirections() {
        this.directions = _.map(this.model.directions, item => this.translateService.instant(`direction.${item}`)).join(', ');
    }


    handleAfterSubmit() {
        this.loadData();
    }

    handleModalVisible(flag = true) {
        this.modalVisible = !!flag;
    }

    handleAreaVisible(flag = true) {
        this.areaVisible = !!flag;
    }
}