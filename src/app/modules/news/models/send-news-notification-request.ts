import { BaseModel } from 'app/models/BaseModel';

export class SendNewsNotificationRequest extends BaseModel {
    groupId?: string;
    stringId?: string;
    teamId?: string;
    userLevelId?: string;
    userId?: string;
    userType?: string;
    userIds?: string[];
    userTypes?: string[];

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
