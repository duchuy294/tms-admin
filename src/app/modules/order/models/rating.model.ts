import { BaseModel } from 'app/models/BaseModel';

export class RatingModel extends BaseModel {
    userId?: string;
    name?: string;
    servicerId?: string;
    type?: string;
    improve?: string;
    orderId?: string;
    rate?: number;
    reason?: string;
    orderCode?: string;
}
