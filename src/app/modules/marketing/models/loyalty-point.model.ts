import { BaseModel } from 'app/models/BaseModel';
export class LoyaltyPoint extends BaseModel {
    type: string;
    userId: string;
    userType: string;
    orderId: string;
    orderCode: string;
    expiredAt: string;
    code: string;
    point: number;
    name: string;
    createdBy: string;
}