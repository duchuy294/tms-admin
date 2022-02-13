import { BaseModel } from 'app/models/BaseModel';
import { LocationModel } from '@/models/location.model';
export class DeliveryPointModel extends BaseModel {
    name: string;
    phone: string;
    location: LocationModel;
    mapAddress: string;
    endUserId: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}