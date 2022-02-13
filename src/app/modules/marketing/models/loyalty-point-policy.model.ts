import * as moment from 'moment';
import { BaseModel } from 'app/models/BaseModel';
import { Status } from 'app/constants/status.enum';

export class LoyaltyPointPolicyModel extends BaseModel {
    name?: string;
    code?: string;
    priority?: number;
    images: string[] = [];
    image?: string;
    description?: string;
    content?: string;
    status = Status.ACTIVE;

    effectedAt = moment().add(1, 'day').valueOf();
    expiredAt = moment().add(8, 'day').valueOf();
    details = [];

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}