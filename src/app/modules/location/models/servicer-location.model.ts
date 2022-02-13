import { BaseModel } from 'app/models/BaseModel';
import { LocationModel } from 'app/models/location.model';

export class ServicerLocationModel extends BaseModel {
    servicerId: string;
    location: LocationModel;
    vehicleTypeId: string;
    bearing: number;
    state?: string;

}