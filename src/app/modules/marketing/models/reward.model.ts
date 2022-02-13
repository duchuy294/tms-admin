import * as moment from 'moment';
import { BaseModel } from 'app/models/BaseModel';
import { Condition } from './condition';
import { LimitQuantity, PromotionCodeModel } from 'app/modules/marketing/models/promotion-code';
import { RewardType } from 'app/modules/marketing/constants/reward-type';
import { Status } from 'app/constants/status.enum';

export class RewardModel extends BaseModel {
    name?: string;
    code?: string;
    order = 1;
    status = Status.NEW;
    type = RewardType.PROMOTION_CODE;
    description?: string;
    effectedAt = moment().add(1, 'day').valueOf();
    expiredAt = moment().add(8, 'day').valueOf();
    rewardCatIds: string[] = [];
    rewardProviderId?: string;
    point = 0;
    image: string;
    content?: string;
    quantity = 0;
    promotions = new PromotionCodeModel();
    limitedQuantityByUser = new LimitQuantity();
    limitedQuantityByPeriod = new LimitQuantity();
    appliedCondition?: Condition;
    displayCondition?: Condition;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}