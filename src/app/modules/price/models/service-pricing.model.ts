import * as _ from 'lodash';
import { ServicePricingType } from './../constants/service-pricing-type';

export class ServicePricingModel {
    _id: string;
    name?: string;
    imgUrl?: string;
    imgContentUrl?: string;
    type?: ServicePricingType;
    changed?: boolean;

    constructor(item: any = null) {
        _.assignIn(this, item);
    }
}
