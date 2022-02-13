import { BaseModel } from 'app/models/BaseModel';

export class SendRewardRequest extends BaseModel {
    groupId?: string;
    stringId?: string;
    teamId?: string;
    userLevelId?: string;
    userIds?: string[];
    userTypes?: string[];
    note?: string;
    rewardType?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
