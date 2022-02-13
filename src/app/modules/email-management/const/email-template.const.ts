import { Status } from '@/constants/status.enum';

export enum EmailTemplateType {
    RECEIVE_RESPONSE = 'receiveResponse',
    REPLY_RESPONSE = 'replyResponse'
}

export class EmailTemplate {
    static readonly types = Object.keys(EmailTemplateType).map(key => EmailTemplateType[key]);
    static readonly statuses = [Status.NEW, Status.ACTIVE];
}