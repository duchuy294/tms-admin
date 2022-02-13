import * as _ from 'lodash';
import { ApiSystemHttpService } from './api-system-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { MenuItemModel } from './../models/menu-item.model';

@Injectable()
export class MenuService extends BaseService {
    constructor(private apiHttpService: ApiSystemHttpService) {
        super();
    }

    async list() {
        return this.returnList(
            await this.apiHttpService.get('menu-items')
        ) as MenuItemModel[];
    }

    async create(model: MenuItemModel) {
        return await this.apiHttpService.post(`menu-item`, model);
    }

    async update(model: MenuItemModel) {
        return await this.apiHttpService.put(
            `menu-item/${model._id}`,
            _.omit(model, ['_id'])
        );
    }

    async delete(model: MenuItemModel) {
        return await this.apiHttpService.delete(`menu-item/${model._id}`);
    }
}
