import { BaseModel } from 'app/models/BaseModel';
import { VehicleTypePrice } from 'app/models/vehicle-type-price.model';

export class DeliveryFeeModel extends BaseModel {
    _id?: string;
    initCost = 0;
    initUserCost = 0;
    initServicerCost = 0;
    initDistance = 0;
    prices: VehicleTypePrice[] = [];
    changed?: boolean;
    stopointPrice = 0;
    vehicleTypeId?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
