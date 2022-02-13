import { ApiHttpServiceObservable } from '@/modules/http/services/api-http.service.observable';
import { BaseService } from './../../../services/base.service';
import { Customer } from './../models/customer-detail.model';
import { Injectable } from '@angular/core';
import { QueryModel } from '../../../models/query.model';

@Injectable()
export class CustomerServiceObservable extends BaseService {
    constructor(private apiHttpService: ApiHttpServiceObservable) { super(); }

    getCustomers(query: QueryModel) {
        return this.apiHttpService.get(`admin/users${query.url()}`);
    }

    getCustomer(id) {
        return this.apiHttpService.get(`admin/user/${id}`);
    }

    createCustomer(query: Customer) {
        return this.apiHttpService.post(`admin/user`, query);
    }

    updateCustomer(model: Customer) {
        return this.apiHttpService.put(`admin/user`, model);
    }

    resetPassword(userId: string, password: string) {
        return this.apiHttpService.put(`admin/user/${userId}/password`, { password });
    }

    deleteCustomer(id: string) {
        return this.apiHttpService.delete(`admin/user/${id}`);
    }
}
