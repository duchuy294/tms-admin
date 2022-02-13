import { BaseModel } from 'app/models/BaseModel';

export class PartnerProcessModel extends BaseModel {
    servicerId?: string;
    groupId?: string;
    date?: string;
    successRatio?: string;
    total?: number;
    completed?: number;
    hour?: number;
    new?: number;
    progress?: string[];
}