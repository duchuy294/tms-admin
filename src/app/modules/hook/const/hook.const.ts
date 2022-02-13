import { HookType } from './hook-type.enum';
import { Status } from '@/constants/status.enum';

export class Hook {
    static readonly types = Object.keys(HookType).map(key => HookType[key]);
    static readonly statuses = [Status.NEW, Status.ACTIVE];
}