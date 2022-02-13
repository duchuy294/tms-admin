import { BaseModel } from 'app/models/BaseModel';
export class EndUser extends BaseModel {
    name: string;
    status: Number;
    phone: string;
    userId?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}