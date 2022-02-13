import { Profile } from '@/modules/profile/models/profile.model';

export class AccountModel extends Profile {
    repassword: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
