import { BaseModel } from '@/models/BaseModel';

export class WarehouseUtilityModel extends BaseModel {
    code?: string;
    status?: number;
    name?: string;
    note?: string;
    createdBy?: string;
    updatedBy?: string;
    constructor(item = null) {
        super(item);
    }
}
