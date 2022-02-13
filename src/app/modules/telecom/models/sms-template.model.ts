import { BaseModel } from '@/models/BaseModel';

export class SmsTemplateModel extends BaseModel {
    code?: string;
    content?: string = '';
    createdBy?: string = '';
    status?: number;
    type?: string = '';
    updatedBy?: string = '';
}