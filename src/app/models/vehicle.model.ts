import { BaseModel } from 'app/models/BaseModel';
import { VehicleType } from '../models/vehicle-type.model';

export class Vehicle extends BaseModel {
    typeId?: string;
    status?: string;
    name?: string;
    number?: string;
    images?: string[] = [];
    registrationCetificateImages?: string[] = [];
    ensuranceImages?: string[] = [];
    vehicleChildrenType?: VehicleType[] = [];
    capacities?: string[] = [];

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
