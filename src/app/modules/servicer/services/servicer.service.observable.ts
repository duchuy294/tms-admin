import * as _ from 'lodash';
import { ApiHttpServiceObservable } from '@/modules/http/services/api-http.service.observable';
import { Injectable } from '@angular/core';
import { QueryModel } from '../../../models/query.model';


@Injectable()
export class ServicerServiceObservable {
    constructor(private apiHttpService: ApiHttpServiceObservable) { }

    getServicers(query: QueryModel) {
        return this.apiHttpService.get(`admin/servicers${query.url()}`);
    }

    getGroupServicers(query = new QueryModel({ limit: 1000 })) {
        return this.apiHttpService.get(
            `admin/servicerGroups${query.url()}`
        );
    }

    getTeams(id: string) {
        return this.apiHttpService.get(
            `admin/servicerTeams/select/${id}`
        );
    }
}
