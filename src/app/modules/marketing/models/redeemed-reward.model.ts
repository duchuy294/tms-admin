import * as moment from 'moment';
import { BaseModel } from 'app/models/BaseModel';
import { Status } from 'app/constants/status.enum';

export class RedeemedRewardModel extends BaseModel {
    policyId?: string;
    code?: string;
    rewardId?: string;
    effectedAt = moment().add(1, 'day').valueOf();
    expiredAt = moment().add(8, 'day').valueOf();
    order = 1;
    quantity = 0;
    usedQuantity = 0;
    used = false;
    isGift = false;
    status = Status.ACTIVE;
    userId: string;
    accountId: string;
    userType?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}