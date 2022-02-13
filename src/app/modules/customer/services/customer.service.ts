import { ApiHttpService } from '../../../modules/http/services/api-http.service';
import { BaseService } from './../../../services/base.service';
import { Customer } from './../models/customer-detail.model';
import { Injectable } from '@angular/core';
import { PagingModel } from './../../utility/components/paging/paging.model';
import { QueryModel } from '../../../models/query.model';
import { ServiceModel } from '@/modules/price/models/service.model';

@Injectable()
export class CustomerService extends BaseService {
    constructor(private apiHttpService: ApiHttpService) { super(); }

    async getCustomers(query: QueryModel) {
        const response = await this.apiHttpService.get(`admin/users${query.url()}`);
        return new PagingModel<Customer>(response.errorCode === 0 ? response.data : null);
    }

    async postCustomers(query: QueryModel) {
        const response = await this.apiHttpService.post(`admin/users`, query);
        return new PagingModel<Customer>(response.errorCode === 0 ? response.data : null);
    }

    async getCustomersAndStaistic(query: QueryModel): Promise<any> {
        const response = await this.apiHttpService.get(`admin/users${query.url()}`);
        return {
            pagingModel: new PagingModel<Customer>(response.errorCode === 0 ? response.data : null),
            statistic: response.data.statistic
        };
    }

    async getCustomer(id) {
        const response = await this.apiHttpService.get(`admin/user/${id}`);
        return response.errorCode === 0 ? new Customer(response.data) : new Customer();
    }

    async createCustomer(query: Customer) {
        return await this.apiHttpService.post(`admin/user`, query);
    }

    async updateCustomer(model: Customer) {
        return await this.apiHttpService.put(`admin/user`, model);
    }

    async resetPassword(userId: string, password: string) {
        const response = await this.apiHttpService.put(`admin/user/${userId}/password`, { password });
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async deleteCustomer(id: string) {
        const response = await this.apiHttpService.delete(`admin/user/${id}`);
        return response.errorCode === 0;
    }

    async getServicesByUser(id: string = null) {
        const response = id ? await this.apiHttpService.get(`admin/services/${id}`) : await this.apiHttpService.get(`admin/services`);
        return this.returnList<ServiceModel>(response);
    }
}
