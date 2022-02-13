import * as _ from 'lodash';

export class BonusForfeitModel {
    groupId: string = '';
    userLevelId: string;
    teamId: string;
    value: number;
    type: string;
    note: string = '';
    userIds?: string[];
    userTypes?: string[];

    public omitFields() {
        return ['teamsDisplay'];
    }
}
