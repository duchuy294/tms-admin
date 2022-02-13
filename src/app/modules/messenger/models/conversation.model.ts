import { BaseModel } from '@/models/BaseModel';
export class ConversationModel extends BaseModel {
    orderId?: string;
    orderCode?: string = '';
    type?: string;
    blockedBy?: string;
    members?: [{ 'userId': string, 'userType': string, 'fullName': string }];
}