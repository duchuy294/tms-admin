import { BaseModel } from 'app/models/BaseModel';
export class ReferralModel extends BaseModel {
    code?: string;
    type?: string;
    userType?: string;
    userId?: string;
    referralCode?: string;
    referralId?: string;
    redeemedRewardIds?: string[];
    bonus?: number;
    referralPolicyId?: string;
    walletType?: string;
}