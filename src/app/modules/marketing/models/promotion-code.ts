import { BaseModel } from 'app/models/BaseModel';
import { PromotionPolicyModel } from '../models/promotion-policy';

export class Condition {
  userId?: any;
  userLevelId?: any;
  orderType?: any;
  createdAt?: any;
  dayPeriod?: any;
  location?: any;
  service?: any;
  paymentMethod?: any;
  depositAmount?: any;
  depositTime?: any;
  servicerCost?: any;
  realCost?: any;
  baseUserCost?: any;
  numberOfOrder?: any;
  numberOfWorkingDay?: any;
  incomeAmount?: any;
  displayedAt?: any;
  servicerRating?: any;
  limitedQuantityByDayAndUser?: any;
  limitedQuantityByWeekAndUser?: any;
  limitedQuantityByMonthAndUser?: any;
  limitedQuantityByUser?: any;
  limitedQuantityByDay?: any;
  limitedQuantityByWeek?: any;
  limitedQuantityByMonth?: any;

}

export class LimitQuantity {
  basedOn = 'day';
  quantity = 1;
}

export class PromotionCodeType {
  static promotion: string = 'promotion';
  static reward: string = 'reward';
}

export class DiscountType {
  static amount: string = 'amount';
  static percent: string = 'percent';
  static samePrice: string = 'samePrice';
}

export class PromotionCodeModel extends BaseModel {
  name?: string;
  policyId?: string;
  code: string;
  image?: string;
  type?: string = PromotionCodeType.promotion;
  status?: number = 1;
  note?: string;
  effectedAt?: number;
  expiredAt?: number;
  priority?: number;
  quantity?: number = 0;
  userType?: string = null;
  userId?: string = null;
  discType = DiscountType.amount;
  discAmount?: number = 0;
  discPercent?: number = 0;
  discMaximumAmount = 0;
  discSamePrice?: number = 0;
  diffPercentByServicer = 0;
  conditions?: Condition;
  promotionPolicy?: PromotionPolicyModel;
  isGift?: boolean;

  constructor(item?: PromotionCodeModel) {
    super();
    this.mapFields(item);
  }
}
