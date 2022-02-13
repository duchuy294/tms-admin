import { BaseModel } from 'app/models/BaseModel';
export class AppliedPromotionCodeModel extends BaseModel {
    orderCode?: string;
    promotionAmount?: number;
}