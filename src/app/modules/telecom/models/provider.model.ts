import { BaseModel } from '@/models/BaseModel';

export class ProviderModel extends BaseModel {
    code?: string;
    confirmPwd?: string;
    createdBy?: string;
    from?: string;
    name?: string;
    pwd?: string;
    status?: number;
    type?: string;
    u?: string;
    updatedBy?: string;
    url?: string;
}