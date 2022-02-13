import { SmsTemplateType } from './sms-template.enum';
import { Status } from '@/constants/status.enum';

export class SmsTemplate {
    static readonly types = Object.keys(SmsTemplateType).map(key => SmsTemplateType[key]);
    static readonly statuses = [Status.NEW, Status.ACTIVE];
}