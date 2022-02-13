import { BaseModel } from 'app/models/BaseModel';
import { Status } from 'app/constants/status.enum';

export class RewardCategoryModel extends BaseModel {
    name?: string;
    code?: string;
    status = Status.ACTIVE;
    order = 1;
    description?: string;
    image?: string;
    content?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}