import { BaseModel } from 'app/models/BaseModel';

export class Profile extends BaseModel {
    id?: number;
    phone?: string;
    fullName?: string;
    address?: string;
    email?: string;
    password?: string;
    roles: string[] = [];
    avatar?: string;
    createdAt?: number;
    status?: number;
    lang: string;
    groupId: string;
    branchId: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
