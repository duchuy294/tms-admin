import { ApiHttpServiceObservable } from '@/modules/http/services/api-http.service.observable';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { QueryModel } from '../../../models/query.model';

@Injectable()
export class EndUserServiceObservable extends BaseService {
    constructor(private apiHttpService: ApiHttpServiceObservable) { super(); }

    getEndUsers(query: QueryModel) {
        return this.apiHttpService.get(`admin/end-users${query.url()}`);
    }

    getSubEndUsers(query: QueryModel) {
        return this.apiHttpService.get(`admin/sub-end-users${query.url()}`);
    }
}
