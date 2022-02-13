import { ApiDeliveryHttpService } from 'app/modules/delivery/services/api-delivery-http.service';
import { BaseService } from '@/services/base.service';
import { CategoryModel } from '@/modules/categories/model/category.model';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesService extends BaseService {
    constructor(public apiHttpService: ApiDeliveryHttpService) {
        super();
    }

    async get() {
        const response = await this.apiHttpService.get('categories');
        return response.errorCode === 0 ? response.data : [];
    }

    async delete(id: string) {
        return this.returnSuccess(
            await this.apiHttpService.delete(`category/${id}`)
        );
    }

    async update(item: CategoryModel) {
        return await this.apiHttpService.put(`category/${item._id}`, item);
    }

    async create(item: CategoryModel) {
        return await this.apiHttpService.post(`category`, item);
    }
}
