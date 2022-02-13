import { ApiHttpService } from '../../http/services/api-http.service';
import { CityModel, DistrictModel } from '../../location/components/address/address.model';
import { Injectable } from '@angular/core';
import { TeamServicer } from '../../servicer/models/team-servicer/team-servicer.model';

@Injectable()
export class FilterService {
    constructor(
        private apiHttpService: ApiHttpService
    ) { }

    async getCities() {
        const response = await this.apiHttpService.get(`general/cities`);
        return response.errorCode === 0 ? (response.data as CityModel[]) : [];
    }

    async getDistricts(id: string) {
        const response = await this.apiHttpService.get(
            `general/districts/${id}`
        );
        return response.errorCode === 0 ? (response.data as DistrictModel[]) : [];
    }

    async getTeams() {
        const response = await this.apiHttpService.get(
            `admin/servicerTeams`
        );
        return response.errorCode === 0 ? (response.data.data as TeamServicer[]) : [];
    }
}
