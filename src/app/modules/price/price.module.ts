import { ApiPriceHttpService } from './services/api-price-http.service';
import { CollectionService } from './services/collection.service';
import { DeliveryFeeService } from './services/delivery-fee.service';
import { NgModule } from '@angular/core';
import { PriceFormService } from 'app/modules/price/services/price-form.service';
import { ServicePricingService } from 'app/modules/price/services/service-pricing.service';
import { ServiceService } from 'app/modules/price/services/service.service';

@NgModule({
    providers: [
        ApiPriceHttpService,
        CollectionService,
        DeliveryFeeService,
        PriceFormService,
        ServicePricingService,
        ServiceService,
    ]
})
export class PriceModule { }