import { ApiHttpService } from '@/modules/http/services/api-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { UserLevelModel } from '../models/user-level.model';

@Injectable()
export class UserLevelService extends BaseService {
    constructor(private apiHttpService: ApiHttpService) {
        super();
    }

    async create(model: UserLevelModel) {
        const response = await this.apiHttpService.post(
            'admin/user-level',
            model
        );

        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async update(model: UserLevelModel) {
        const response = await this.apiHttpService.put(
            `admin/user-level/${model._id}`,
            omit(model, ['_id'])
        );

        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async delete(id) {
        const response = await this.apiHttpService.delete(
            `admin/user-level/${id}`
        );
        return this.returnSuccess(response);
    }

    async getUserLevels(query: QueryModel) {
        const response = await this.apiHttpService.get(
            `admin/user-levels${query.url()}`
        );
        return response.errorCode === 0
            ? new PagingModel<UserLevelModel>(response.data)
            : new PagingModel<UserLevelModel>();
    }

    async get(id: string) {
        const response = await this.apiHttpService.get(
            `admin/user-level/${id}`
        );
        return new UserLevelModel(this.returnObj<UserLevelModel>(response));
    }
}
