import { PriceSettingType } from './../constants/PriceSettingType';
import { ApiHttpService } from './../../../modules/http/services/api-http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PriceSettingService {
    constructor(public apiHttpService: ApiHttpService) { }

    async update(type: PriceSettingType, id: string, data: object) {
        const response = await this.apiHttpService.put(`admin/setting/price/${type}/${id}`, data);

        return response.errorCode === 0;
    }

    async delete(type: PriceSettingType, id: string) {
        const response = await this.apiHttpService.delete(`admin/setting/price/${type}/${id}`);

        return response.errorCode === 0;
    }

    async add(type: PriceSettingType, data: object) {
        const response = await this.apiHttpService.post(`admin/setting/price/${type}`, data);

        return response.errorCode === 0;
    }
}
