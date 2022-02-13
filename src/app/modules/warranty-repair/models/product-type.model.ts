import { BaseModel } from '@/models/BaseModel';

export class ProductTypeModel extends BaseModel {
    _id?: string;
    name?: string;
    code?: string;
    image?: string;
    priority?: number;
    brandIds?: string[];

    constructor(item = null) {
        super(item);
    }
}
