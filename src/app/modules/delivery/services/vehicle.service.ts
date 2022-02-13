import * as _ from 'lodash';
import { ApiDeliveryHttpService } from './api-delivery-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { VehicleType } from './../../../models/vehicle-type.model';

@Injectable()
export class VehicleService extends BaseService {
    constructor(private _apiHttpService: ApiDeliveryHttpService) {
        super();
    }

    async getVehicleTypes(structure = true): Promise<VehicleType[]> {
        const response = await this._apiHttpService.get(
            `vehicle-types?structure=${structure}`
        );
        return this.returnList(response);
    }

    async deleteVehicle(id: string) {
        return this.returnSuccess(
            await this._apiHttpService.delete(`vehicle-type/${id}`)
        );
    }

    async update(vehicleType: VehicleType) {
        return await this._apiHttpService.put(
            `vehicle-type/${vehicleType._id}`,
            _.omit(vehicleType, ['_id', 'fee', 'changed'])
        );
    }
}
