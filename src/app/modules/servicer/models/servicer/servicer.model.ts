import { AddressModel } from '../../../location/components/address/address.model';
import { BaseModel } from 'app/models/BaseModel';
import { LocationModel } from '../../../../models/location.model';
import { ServicerType } from '../../../../constants/ServicerType';
import { SystemBankAccountModel } from '../../../finance/models/system-bank-account.model';
import { TeamServicer } from '../team-servicer/team-servicer.model';
import { Vehicle } from './../../../../models/vehicle.model';

export class Servicer extends BaseModel {
    code?: string;
    deposit = 0;
    fullName?: string;
    enterpriseId?: string;
    phone?: string;
    email?: string;
    identityNumber?: string;
    status?: number;
    statusName?: string;
    selected?: boolean;
    teams?: TeamServicer[] = [];
    lang?: string;
    currency?: string = 'VND';
    type?: ServicerType = ServicerType.Personal;
    vehicleImages?: string[] = [];
    identityCardImages?: string[] = [];
    driverLicenseImages?: string[] = [];
    businessCertificateImages?: string[] = [];
    password?: string;
    groupId?: string;
    images?: string[] = [];
    address = new AddressModel();
    bank = new SystemBankAccountModel();
    rate?: number;
    rateTimes?: number;
    location?: LocationModel;
    state: boolean;
    vehicles?: Vehicle[];
    vehicle?: Vehicle;
    userLevelIds?: string[] = [];
    serveLevelIds?: string[] = [];
    referralId?: string;
    referralCode?: string;
    limitOrder?: number;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }

    public omitFields() {
        return super.omitFields().concat(['fullName']);
    }
}

export class ServicerPage extends Servicer {
    numberOfOrders?: number;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
