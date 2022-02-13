import { BaseModel } from 'app/models/BaseModel';
export class LoyaltyPointAdjustModel extends BaseModel {
    userType: string = 'user';
    type: string = 'adjustIncrease';
    userCode?: string;
    point: number;
    note: string;
}