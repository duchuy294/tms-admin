import * as _ from 'lodash';
import { ApiHttpService } from '../../../modules/http/services/api-http.service';
import { BaseService } from './../../../services/base.service';
import { EndUser } from './../models/enduser-detail.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from './../../utility/components/paging/paging.model';
import { QueryModel } from '../../../models/query.model';

@Injectable()
export class EndUserService extends BaseService {
    constructor(private apiHttpService: ApiHttpService) { super(); }

    async getEndusers(query: QueryModel) {
        const response = await this.apiHttpService.get(`admin/end-users${query.url()}`);
        return new PagingModel<EndUser>(response.errorCode === 0 ? response.data : null);
    }

    async getEnduser(id) {
        const response = await this.apiHttpService.get(`admin/end-user/${id}`);
        return response.errorCode === 0 ? new EndUser(response.data) : new EndUser();
    }

    async createEnduser(query: EndUser) {
        return await this.apiHttpService.post(`admin/end-user`, query);
    }

    async updateEnduser(model: EndUser) {
        return await this.apiHttpService.put(`admin/end-user/${model._id}`, omit(model, ['_id']));
    }

    async deleteEnduser(id: string) {
        return await this.apiHttpService.delete(`admin/end-user/${id}`);
    }

    async import(file: any, userId: String) {
        const formData = new FormData();
        formData.append(file.name, file.file);
        const response = await this.apiHttpService.post(`admin/end-users/import/${userId}`, formData);
        file.onSuccess(response, file.file);
        return response.errorCode === 0;
    }

}