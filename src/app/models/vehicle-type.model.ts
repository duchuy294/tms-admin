import { BaseModel } from 'app/models/BaseModel';
import { MultiLanguageString } from './multi-language/multi-string';
import { VehicleTypePrice } from './vehicle-type-price.model';

export class VehicleType extends BaseModel {
    _id?: string;
    name?: MultiLanguageString;
    imgUrl?: string;
    selectedImgUrl?: string;
    markerIcon?: string;
    markerSmIcon?: string;
    markerProcessing?: string;
    markerGrooving?: string;
    markerReturn?: string;
    markerCod?: string;
    markerIncident?: string;
    markerOffline?: string;
    maxWeight?: number;
    initCost?: number;
    initDistance?: number;
    prices?: VehicleTypePrice[];
    children?: VehicleType[];
    changed?: boolean;
    parentId?: string;
    stopointPrice = 0;
    type?: number;
    sizeId?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
