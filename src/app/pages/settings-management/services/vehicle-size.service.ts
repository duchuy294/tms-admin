import { ApiDeliveryHttpService } from 'app/modules/delivery/services/api-delivery-http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class VehicleSizeService {
    constructor(public apiHttpService: ApiDeliveryHttpService) {}
    async get() {
        const response = await this.apiHttpService.get(
            'vehicle-size-standards'
        );
        return response.errorCode === 0 ? response.data : [];
    }
}
