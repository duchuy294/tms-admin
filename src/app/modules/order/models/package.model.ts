import * as _ from 'lodash';
import { OrderModel } from './order.model';

export class PackageModel {
    packageNo?: string;
    orders: OrderModel[] = [];
    soCode = '';
    valid = false;
    totalPackage?: number;

    constructor(item: PackageModel) {
        _.assignIn(this, item);
    }
}
