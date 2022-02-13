import * as _ from 'lodash';
import { CollectionFeeModel } from 'app/modules/price/models/collection-fee.model';
import { CollectionService } from 'app/modules/price/services/collection.service';
import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServiceService } from 'app/modules/price/services/service.service';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';
import { ServiceUnitModel } from 'app/modules/price/models/service-unit.model';
import { ServiceUnitService } from 'app/pages/settings-management/services/service-unit.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'addition-service',
    templateUrl: 'addition-service.component.html'
})
export class AdditionServiceComponent implements OnInit {
    @Input() public priceFormId;
    public collectionFees: CollectionFeeModel[] = [];
    public addonServices: ServiceModel[] = [];
    public newCollectionFee = new CollectionFeeModel();
    public units: ServiceUnitModel[] = [];

    constructor(
        public collectionService: CollectionService,
        public serviceService: ServiceService,
        public translateService: TranslateService,
        public messageService: NzMessageService,
        public serviceUnitService: ServiceUnitService) { }

    async ngOnInit() {
        this.units = await this.serviceUnitService.list();
        await this._loadCollectionFee();
        await this._loadAddonServices();
    }

    private async _loadCollectionFee() {
        const collectionFeeQuery = new QueryModel({ priceFormId: this.priceFormId, limit: 1000 });
        const collectionFeePaging = await this.collectionService.filter(collectionFeeQuery);
        const decimalPipe = new DecimalPipe('vi-VN');
        _.map(collectionFeePaging.data, x => {
            x.toFormatted = decimalPipe.transform(x.to);
        });

        this.collectionFees = collectionFeePaging.data;
    }

    private async _loadAddonServices() {
        const servicePaging = await this.serviceService.filter(new QueryModel({ structure: true, limit: 1000, priceFormId: this.priceFormId, style: `${ServiceStyle.Delivery_ReturnPickPoint},${ServiceStyle.Delivery_Porters}` }));
        const serviceWithChildren = _.filter(servicePaging.data, x => !!x.children);
        const serviceWithoutChildren = _.filter(servicePaging.data, x => !x.children);
        this.addonServices = _.concat(serviceWithChildren, serviceWithoutChildren.length === 0 ? [] : [new ServiceModel({ name: this.translateService.instant('others'), children: serviceWithoutChildren })]);
    }

    async updateCollectionFee(fee: CollectionFeeModel) {
        const success = await this.collectionService.update(fee);
        if (success) {
            fee.changed = false;
            alert('success!');
        } else {
            alert('failure!');
        }
    }

    async addCollectionFee() {
        const success = await this.collectionService.add(this.newCollectionFee);
        if (success) {
            await this._loadCollectionFee();
            this.newCollectionFee = new CollectionFeeModel();
            alert('success!');
        } else {
            alert('failure!');
        }
    }

    async deleteCollectionFee(id: number) {
        const success = await this.collectionService.delete(id);
        if (success) {
            await this._loadCollectionFee();
            alert('success!');
        } else {
            alert('failure!');
        }
    }

    async updateAddonService(service: ServiceModel) {
        service.priceFormId = this.priceFormId;
        const response = service._id ? await this.serviceService.update(service._id, _.omit(service, ['changed'])) : await this.serviceService.add(_.omit(service, ['changed']));
        if (response.errorCode === 0) {
            await this._loadAddonServices();
        } else {
            this.messageService.error(response.message);
        }
    }

    async addChildService(parentService: ServiceModel) {
        parentService.children.push(new ServiceModel({
            priceFormId: this.priceFormId,
            parentId: parentService._id,
            style: parentService.style,
            type: parentService.type,
            unit: parentService.unit,
            price: 0,
            realPrice: 0,
            userPrice: 0,
            servicerPrice: 0,
            changed: true
        }));
    }

    async removeChildService(service: ServiceModel, parentService: ServiceModel) {
        if (service._id) {
            if (confirm(this.translateService.instant('common.confirmDelete'))) {
                const response = await this.serviceService.delete(service._id);
                if (response.errorCode === 0) {
                    await this._loadAddonServices();
                } else {
                    this.messageService.error(response.message);
                }
            }
        } else {
            _.remove(parentService.children, item => item === service);
        }
    }
}
