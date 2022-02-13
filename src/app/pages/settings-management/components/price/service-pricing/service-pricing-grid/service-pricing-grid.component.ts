import * as _ from 'lodash';
import { Component, Input, OnChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ServicePricingModel } from 'app/modules/price/models/service-pricing.model';
import { ServicePricingService } from 'app/modules/price/services/service-pricing.service';
import { ServicePricingType } from '@/modules/price/constants/service-pricing-type';

@Component({
    selector: 'service-pricing-grid',
    templateUrl: 'service-pricing-grid.component.html',
    styleUrls: ['./service-pricing-grid.less']
})
export class ServicePricingGridComponent implements OnChanges {
    @Input() servicePricings: ServicePricingModel[] = [];
    @Input() type: ServicePricingType;
    @Input() title;
    public fileList: {};

    constructor(private message: NzMessageService, private service: ServicePricingService) { }
    public async ngOnChanges() {
        await this._loadData();
    }

    async _loadData() {
        this.updateDefaultImage();
    }

    public updateDefaultImage() {
        this.fileList = {};
        _.forEach(this.servicePricings, servicePricing => {
            this.fileList = {
                ...this.fileList, [servicePricing._id]: {
                    imgUrl: [{
                        url: servicePricing.imgUrl || '',
                        status: 'done'
                    }],
                    imgContentUrl: [{
                        url: servicePricing.imgContentUrl || '',
                        status: 'done'
                    }
                    ]
                }
            };
        });
    }

    public addNew() {
        const newServicePricing = new ServicePricingModel({ type: this.type });
        this.servicePricings.unshift(newServicePricing);
        newServicePricing._id = `new${this.servicePricings.length}`;
        this.updateDefaultImage();

    }

    public async remove(pricing: ServicePricingModel) {
        if (/^new/.test(pricing._id)) {
            const newIndex = this.servicePricings.findIndex(service => service._id === pricing._id);
            if (newIndex !== -1) {
                this.servicePricings.splice(newIndex, 1);
            }
        } else {
            const isOk = await this.service.delete(pricing._id);
            if (isOk) {
                this.message.success('Xoá biểu giá thành công', { nzDuration: 1000 });
                await this._loadData();
            }
        }
        this.updateDefaultImage();

    }

    public async save(pricing: ServicePricingModel) {
        const isOk = pricing._id && !/^new/.test(pricing._id) ? await this.service.update(pricing) : await this.service.add(pricing);
        if (isOk) {
            this.message.success('Lưu dữ liệu thành công', { nzDuration: 1000 });
            await this._loadData();
        }
    }

    public updateImg($event, pricing: ServicePricingModel) {
        pricing.imgUrl = '';
        if ($event.length) {
            pricing.imgUrl = $event[0];
        }
        pricing.changed = true;
    }

    public updateContentImg($event, pricing: ServicePricingModel) {
        pricing.imgContentUrl = '';
        if ($event.length) {
            pricing.imgContentUrl = $event[0];
        }
        pricing.changed = true;
    }
}
