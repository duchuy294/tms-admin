import { AddressModel } from '../../location/components/address/address.model';

export class BankModel {
    _id?: string;
    name?: string = '';
    image?: string;
    address = new AddressModel();
    phone?: string = '';
    fax?: string = '';
    email?: string = '';
    website?: string = '';
    note?: string = '';
    status?: number;
}