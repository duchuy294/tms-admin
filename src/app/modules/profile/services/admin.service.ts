import { ApiAuthHttpService } from './../../http/services/api-auth-http.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ProfileService {
    constructor(private apiHttpService: ApiAuthHttpService) { }

    public async verify() {
        const response = await this.apiHttpService.get(`verification`);

        return response.errorCode === 0 ? response.data : null;
    }
}
