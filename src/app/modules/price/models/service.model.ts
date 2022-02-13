import { BaseModel } from 'app/models/BaseModel';
import { ServiceStyle } from './../constants/ServiceStyle';
import { ServiceType } from './../constants/ServiceType';

export class ServiceModel extends BaseModel {
    _id?: string;
    name?: string;
    value?: string;
    price = 0;
    userPrice = 0;
    servicerPrice = 0;
    changed?: boolean;
    style?: ServiceStyle;
    type?: ServiceType;
    imgUrl?: any;
    children?: ServiceModel[];
    parentId?: string;
    parent?: ServiceModel;
    unit?: string;
    note?: string;
    vehicleTypeId?: string;
    distance?: number;
    cost?: number;
    quantity?: number;
    selected?: boolean;
    pointId?: string;
    commission = 0;
    priceFormId?: string;
    startedAt?: number;
    finishedAt?: number;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
