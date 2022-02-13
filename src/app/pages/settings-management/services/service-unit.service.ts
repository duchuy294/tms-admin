import { ApiHttpService } from './../../../modules/http/services/api-http.service';
import { Injectable } from '@angular/core';
import { ServiceUnitModel } from 'app/modules/price/models/service-unit.model';

@Injectable()
export class ServiceUnitService {
    constructor(public apiHttpService: ApiHttpService) { }
    async list(): Promise<ServiceUnitModel[]> {
        const response = await this.apiHttpService.get('admin/service-units');

        return response.errorCode === 0 ? response.data : [];
    }
}
