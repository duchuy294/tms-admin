import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { QueryModel } from '@/models/query.model';
import { ServicePricingModel } from 'app/modules/price/models/service-pricing.model';
import { ServicePricingService } from 'app/modules/price/services/service-pricing.service';
import { ServicePricingType } from 'app/modules/price/constants/service-pricing-type';

@Component({
    selector: 'service-pricing',
    templateUrl: 'service-pricing.component.html'
})
export class ServicePricingComponent implements OnInit {
    @Input() public priceFormId;
    public queryModel: QueryModel;
    public deliveryServicePricings: ServicePricingModel[] = [];
    public installationServicePricings: ServicePricingModel[] = [];
    public ServicePricingType = ServicePricingType;

    constructor(public servicePricingService: ServicePricingService) { }

    public async ngOnInit() {
        const servicePricingPaging = await this.servicePricingService.filter(new QueryModel({ limit: 1000, priceFormId: this.priceFormId }));
        this.deliveryServicePricings = _.filter(servicePricingPaging.data, x => x.type === ServicePricingType.DELIVERY);
        this.installationServicePricings = _.filter(servicePricingPaging.data, x => x.type === ServicePricingType.INSTSLLATION);
    }
}
