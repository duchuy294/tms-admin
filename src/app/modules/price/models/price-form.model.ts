import { BaseModel } from 'app/models/BaseModel';

export class PriceFormModel extends BaseModel {
    default = false;
    deliveryCommission = 0;
    deliveryInstallationCommission = 0;
    installationCommission = 0;
    name?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}