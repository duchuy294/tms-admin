import { BaseModel } from 'app/models/BaseModel';

export class HookLinkModel extends BaseModel {
    types?: string[] = [];
    link?: string;
    userId?: string;
    servicerId?: string;
}