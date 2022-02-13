import { ApiWarehouseHttpService } from './api-warehouse-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { WarehouseModel } from '../models/warehouse.model';
import { WarehouseServiceModel } from '../models/warehouseService.model';
import { WarehouseTimelineModel } from '../models/warehouseTimeline.model';
import { WarehouseUtilityModel } from '../models/warehouseUtility.model';

@Injectable()
export class WarehouseService extends BaseService {
    constructor(private apiHttpService: ApiWarehouseHttpService) {
        super();
    }

    async filterWarehouse(query: QueryModel): Promise<PagingModel<WarehouseModel>> {
        const response = await this.apiHttpService.get(`warehouses${query.url()}`);
        return new PagingModel<WarehouseModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getWarehouse(id: string): Promise<WarehouseModel> {
        return this.returnObj<WarehouseModel>(await this.apiHttpService.get(`warehouse/${id}`));
    }

    async createWarehouse(model: WarehouseModel) {
        return await this.apiHttpService.post(`warehouse`, model);
    }

    async updateWarehouse(model: WarehouseModel) {
        return await this.apiHttpService.put(`warehouse/${model._id}`, omit(model, ['_id']));
    }

    async deleteWarehouse(id): Promise<any> {
        return await this.apiHttpService.delete(`warehouse/${id}`);
    }


    async filterWarehouseType(query: QueryModel): Promise<PagingModel<any>> {
        const response = await this.apiHttpService.get(`warehouse-types${query.url()}`);
        return new PagingModel<any>(
            response.errorCode === 0 ? response.data : {}
        );
    }


    async filterService(query: QueryModel): Promise<PagingModel<WarehouseServiceModel>> {
        const response = await this.apiHttpService.get(`services${query.url()}`);
        return new PagingModel<WarehouseServiceModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getService(id: string): Promise<WarehouseServiceModel> {
        return this.returnObj<WarehouseServiceModel>(await this.apiHttpService.get(`service/${id}`));
    }

    async createService(model: WarehouseServiceModel) {
        return await this.apiHttpService.post(`service`, model);
    }

    async updateService(model: WarehouseServiceModel) {
        return await this.apiHttpService.put(`service/${model._id}`, omit(model, ['_id']));
    }

    async activateService(id, active = false) {
        return await this.apiHttpService.put(`service/activate/${id}`, { active });
    }

    async deleteService(id): Promise<any> {
        return await this.apiHttpService.delete(`service/${id}`);
    }


    async filterUtility(query: QueryModel): Promise<PagingModel<WarehouseUtilityModel>> {
        const response = await this.apiHttpService.get(`utilities${query.url()}`);
        return new PagingModel<WarehouseUtilityModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getUtility(id: string): Promise<WarehouseUtilityModel> {
        return this.returnObj<WarehouseUtilityModel>(await this.apiHttpService.get(`utility/${id}`));
    }

    async createUtility(model: WarehouseUtilityModel) {
        return await this.apiHttpService.post(`utility`, model);
    }

    async updateUtility(model: WarehouseUtilityModel) {
        return await this.apiHttpService.put(`utility/${model._id}`, omit(model, ['_id']));
    }

    async activateUtility(id, active = false) {
        return await this.apiHttpService.put(`utility/activate/${id}`, { active });
    }

    async deleteUtility(id): Promise<any> {
        return await this.apiHttpService.delete(`utility/${id}`);
    }

    async filterTimeline(query: QueryModel): Promise<PagingModel<WarehouseTimelineModel>> {
        const response = await this.apiHttpService.get(`pricing-timelines${query.url()}`);
        return new PagingModel<WarehouseTimelineModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getTimeline(id: string): Promise<WarehouseTimelineModel> {
        return this.returnObj<WarehouseTimelineModel>(await this.apiHttpService.get(`pricing-timeline/${id}`));
    }

    async createTimeline(model: WarehouseTimelineModel) {
        return await this.apiHttpService.post(`pricing-timeline`, model);
    }

    async updateTimeline(model: WarehouseTimelineModel) {
        return await this.apiHttpService.put(`pricing-timeline/${model._id}`, omit(model, ['_id']));
    }

    async activateTimeline(id, active = false) {
        return await this.apiHttpService.put(`pricing-timeline/activate/${id}`, { active });
    }

    async deleteTimeline(id): Promise<any> {
        return await this.apiHttpService.delete(`pricing-timeline/${id}`);
    }

    async processOrder(orderId: string, model: Object) {
        const response = await this.apiHttpService.put(`order/process/${orderId}`, model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async filterAvailableAreaSummary(query: QueryModel): Promise<PagingModel<WarehouseModel>> {
        return this.returnObj(await this.apiHttpService.get(`availableAreaSummaries${query.url()}`));
    }
}