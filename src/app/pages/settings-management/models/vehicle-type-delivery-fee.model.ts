import { DeliveryFeeModel } from './../../../modules/price/models/delivery-fee.model';
import { VehicleType } from './../../../models/vehicle-type.model';

export class VehicleTypeDeliveryFeeModel extends VehicleType {
    public commission = 0;
    public fee = new DeliveryFeeModel();
    public children: VehicleTypeDeliveryFeeModel[] = [];
    constructor(item = null) {
        super(item);
    }
}