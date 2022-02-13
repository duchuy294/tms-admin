import { BaseModel } from 'app/models/BaseModel';
import { CommonHelper } from '@/utility/common/common.helper';
import { Condition } from './condition';
export class PromotionPolicyControllerModel extends BaseModel {
  name: string;
  status: number;
  priority: number;
  effectedAt: number;
  expiredAt: number;
  content: string;
  createdBy: string;
  code: string;
  priceForms: {};
  deposits: any;
  promotions: any;
}

export class ConditionSet {
  priceFormId: string;
  name: string = '';
  userType: string;
  amountFormat?: number;
  percentFormat?: number;
  conditions: Condition;

  get amount() {
    if (this.amountFormat) {
      return CommonHelper.parseS2N(this.amountFormat);
    }
    return undefined;
  }

  set amount(val) {
    this.amountFormat = val;
  }

  get percent() {
    if (this.percentFormat) {
      return CommonHelper.parseS2N(this.percentFormat);
    }
    return undefined;
  }

  set percent(val) {
    this.percentFormat = val;
  }
}