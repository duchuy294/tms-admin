import { BaseModel } from 'app/models/BaseModel';

export class HookTypeModel extends BaseModel {
    type?: string;
    status?: number;
    requiredFields?: string[] = [];
}