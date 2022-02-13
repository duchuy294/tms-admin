import { AddressModel } from '../../location/components/address/address.model';
import { BaseModel } from 'app/models/BaseModel';
import { CustomerPrivilegeModel } from './customer-privilege.model';
import { CustomerSetting } from './customer-setting.model';
import { LocationModel } from '@/models/location.model';
export class Bank {
    accountNumber: string;
    customerName: string;
    bankId: string;
    agency: string;

    constructor(item = null) {
        this.mapFields(item);
    }

    public mapFields(item) {
        if (item) {
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    this[key] = item[key];
                }
            }
        }
    }
}

export class Customer extends BaseModel {
    code?: string;
    phone?: string;
    fullName?: string;
    email?: string;
    password?: string;
    status?: Number;
    groupId?: string;
    city?: string;
    district?: string;
    address?: AddressModel = new AddressModel();
    lang?: string;
    minCollection?: number = 0;
    maxCollection?: number = 0;
    userLevelId?: string;
    loyaltyPoint = 0;
    avatar?: string;
    businessCertificateImages?: string = '';
    contractImage?: string = '';
    rate?: Number;
    rateTimes?: Number;
    referralId?: string;
    type: number;
    enterpriseId?: string;
    bank?: Bank = new Bank();
    note?: string;
    staffId?: string;
    contractNumber?: string;
    settings = new CustomerSetting();
    privilege = new CustomerPrivilegeModel();
    isHub = false;
    location: LocationModel = null;
    servicerGroupId?: string;
    customerType?: number;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }

}

