import { BaseModel } from '@/models/BaseModel';

export class SmsLogModel extends BaseModel {
    bid?: number;
    content?: string;
    createdBy?: string = '';
    phone?: string;
    responseBody?: string;
    statusCode?: number;
    telecom?: string;
    type?: string;
    updatedBy?: string = '';
}