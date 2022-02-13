import { BaseModel } from 'app/models/BaseModel';
import { Condition } from './condition';

export class PromotionPolicyModel extends BaseModel {
  name: string;
  status: number;
  priority: number;
  effectedAt: number;
  expiredAt: number;
  content: string;
  createdBy: string;
  code: string;
  priceForms?: PriceFormClass[] = [];
  deposits?: any[] = [];
  promotions?: any[] = [];

  constructor(item = null) {
    super();
    this.mapFields(item);
  }
}

class PriceFormClass {
  priceFormId: string;
  name: string;
  conditions: Condition;
}