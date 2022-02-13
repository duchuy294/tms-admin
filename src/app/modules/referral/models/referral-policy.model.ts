import { BaseModel } from 'app/models/BaseModel';

export class ReferralPolicyModel extends BaseModel {
    name: string;
    status?: number;
    description: string;
    createdAt: number;
    updatedBy: string;
    code: string;
    userContent: string = '';
    servicerContent: string = '';
    userSharingContent: string = '';
    servicerSharingContent: string = '';
    userPresentee = { bonus: 0 };
    userPresenter = {};
    servicerPresentee = { bonus: 0 };
    servicerPresenter = {};

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}