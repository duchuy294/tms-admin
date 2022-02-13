import { BaseModel } from 'app/models/BaseModel';

export class VehicleSize extends BaseModel {
    name?: string;
    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
