import { ServiceModel } from 'app/modules/price/models/service.model';

export class TotalFreeQuery {
    distance: number;
    vehicleTypeId: string;
    services?: ServiceModel[] = [];
}
