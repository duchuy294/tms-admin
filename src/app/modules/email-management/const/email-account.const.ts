import { Status } from '@/constants/status.enum';

export enum EmailAccountType {
    AUTOMATIC = 'automatic',
    SYSTEM = 'system',
}

export class EmailAccount {
    static readonly types = Object.keys(EmailAccountType).map(key => EmailAccountType[key]);
    static readonly statuses = [Status.NEW, Status.ACTIVE];
}