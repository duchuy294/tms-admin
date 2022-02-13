import * as _ from 'lodash';
import { ApiHttpService } from 'app/modules/http/services/api-http.service';
import { ApiSystemHttpService } from 'app/modules/system-setting/services/api-system-http.service';
import { BaseService } from 'app/services/base.service';
import { BranchModel } from 'app/modules/admin/models/branch.model';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';

@Injectable()
export class BranchService extends BaseService {
    constructor(
        private _apiHttpService: ApiHttpService,
        private apiHttpService: ApiSystemHttpService
    ) { super(); }

    async filter(query = new QueryModel()) {
        const response = await this._apiHttpService.get(`admin/branches${query.url()}`);

        return this.returnObj<PagingModel<BranchModel>>(response);
    }

    async delete(id: number) {
        const response = await this._apiHttpService
            .delete(`admin/branch/${id}`);

        return this.returnSuccess(response);
    }

    async update(branch: BranchModel) {
        return await this.apiHttpService.put(`branch/${branch._id}`, branch);
    }

    async add(branch: BranchModel) {
        return await this.apiHttpService.post(`branch`, branch);
    }

    async filterBranch(query: QueryModel): Promise<PagingModel<BranchModel>> {
        const response = await this.apiHttpService.get(`branches${query.url()}`);
        return new PagingModel<BranchModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getBranch(id: string = null, query: QueryModel): Promise<BranchModel> {
        const response = await this.apiHttpService.get(`branch/${id}${query.url()}`);
        return response.errorCode === 0 ? response.data : {};
    }

    async removeBranch(id: string = null): Promise<any> {
        const response = await this.apiHttpService.delete(`branch/${id}`);
        return response.errorCode;
    }
}
