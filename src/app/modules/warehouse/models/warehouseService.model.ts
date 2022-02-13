import { BaseModel } from '@/models/BaseModel';

export class WarehouseServiceModel extends BaseModel {
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
