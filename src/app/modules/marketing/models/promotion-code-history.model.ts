import { BaseModel } from 'app/models/BaseModel';
import { PromotionPolicyModel } from '../models/promotion-policy';

export class PromotionCodeHistoryModel extends BaseModel {
  promotionCode: string;
  promotionCodeId: string;
  userId: string;
  promotionAmount: number;
  usedQuantity: number;
  transCode: string;
  promotionPolicy?: PromotionPolicyModel;

  constructor(item = null) {
    super();
    this.mapFields(item);
  }
}
