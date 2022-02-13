import { BaseModel } from 'app/models/BaseModel';

export class Reach extends BaseModel {
    users?: string[] = [];
    teams?: string[] = [];
    summary?: string[] = [];
    staffs: any = {};
    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}

export class Fee {
    total?: string;
    transport?: string;
    collection?: string;
}
