import { AdminRole } from 'app/constants/AdminRole';
import { BaseModel } from 'app/models/BaseModel';

export class AccountGroupModel extends BaseModel {
    _id?: string;
    name?: string;
    status?: string;
    code?: string;
    numberOfAccounts?: string;
    role = AdminRole.ADMIN;
    menuItemIds: string[] = [];

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
