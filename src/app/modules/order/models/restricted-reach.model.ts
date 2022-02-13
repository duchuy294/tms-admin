import { BaseModel } from 'app/models/BaseModel';

export class RestrictedReachModel extends BaseModel {
    userIds: string[] = [];
    servicerIds: string[] = [];
}
