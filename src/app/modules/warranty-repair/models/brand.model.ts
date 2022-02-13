import { BaseModel } from '@/models/BaseModel';

export class BrandModel extends BaseModel {
    _id?: string;
    name?: string;
    code?: string;
    image?: string;
    priority?: number;
    productTypeIds?: string[];
    constructor(item = null) {
        super(item);
    }
}
