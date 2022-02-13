import * as _ from 'lodash';
import { ApiOrderHttpService } from 'app/modules/order/services/api-order-http.service';
import { BaseService } from './../../../services/base.service';
import { CostDetail } from '../models/cost-detail.model';
import { IIncident } from './../models/point-incident.model';
import { Injectable } from '@angular/core';
import { LocationModel } from '@/models/location.model';
import { OrderModel } from '../models/order.model';
import { PagingModel } from './../../utility/components/paging/paging.model';
import { ProductModel } from '../models/product.model';
import { QueryModel } from '@/models/query.model';
import { Reach } from './../../../pages/order-management/models/order-create.model';
import { TranslateService } from '@ngx-translate/core';
import { ApiDeliveryHttpService } from '@/modules/delivery/services/api-delivery-http.service';

@Injectable()
export class OrderService extends BaseService {
    constructor(
        private apiHttpService: ApiOrderHttpService,
        private apiDelivery: ApiDeliveryHttpService,
        private translateService: TranslateService
    ) {
        super();
    }

    async getOrders(query: QueryModel): Promise<PagingModel<OrderModel>> {
        const response = await this.apiHttpService.get(`orders${query.url()}`);

        return new PagingModel<OrderModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getByTypes(type: string, page = 0, limit = 20) {
        return this.getOrders(
            new QueryModel({
                page,
                limit,
                serviceType: type
            })
        );
    }

    async get(id): Promise<OrderModel> {
        const response = await this.apiHttpService.get(`order/${id}`);

        return response.errorCode === 0 ? response.data : null;
    }

    async getCollectionOrders(
        query: QueryModel
    ): Promise<PagingModel<OrderModel>> {
        const response = await this.apiHttpService.get(
            `collection-orders${query.url()}`
        );
        return new PagingModel<OrderModel>(
            response.errorCode === 0 ? response.data : {}
        );
    }

    public isCompletedCollectionPayment(order: OrderModel) {
        return !order.cod || order.cod.remaining === 0;
    }

    public getCompletedCollectionRatio(order: OrderModel) {
        const money = order.cod ? order.cod.total : 0;
        if (money === 0) {
            return 1;
        }

        return (order.cod.total - order.cod.remaining) / money;
    }

    public async payCollection(orderId: string, money: number) {
        const response = await this.apiHttpService.post(
            `collection-order/${orderId}`,
            { value: money }
        );
        return this.returnSuccess(response);
    }

    public getServiceNames(costDetails: CostDetail[]) {
        const self = this;
        return _.map(costDetails[0].children, x => {
            return self.getServiceName(x);
        }).join(',<br />');
    }
    public getServiceNamesJoinByCommas(costDetails: CostDetail[]) {
        const self = this;
        return _.map(costDetails[0].children, x => {
            return self.getServiceName(x);
        }).join(', ');
    }

    public getServiceName(costDetail: CostDetail) {
        return this.translateService.instant(
            `order.service-style${costDetail.style}.name`
        );
    }

    async requestProcessingIncident(order: OrderModel) {
        const response = await this.apiHttpService.get(
            `incident-order/${order._id}`
        );
        return this.returnSuccess(response);
    }

    getIncidents(order: OrderModel) {
        const pointHasIncident = _.filter(order.detail.points, x =>
            [5, 6].includes(x.status)
        );
        let incidents: IIncident[] = [];
        pointHasIncident.forEach(point => {
            const userIncidents = point.userIncidents
                ? point.userIncidents
                : [];
            incidents = _.concat(
                incidents,
                _.filter(userIncidents, x => [0, 1].includes(x.status))
            );
        });

        return _.join(
            _.map(incidents, x => x.title),
            '<br />'
        );
    }

    async updateReach(id: string, reach: Reach) {
        const response = await this.apiHttpService.put(
            `order/${id}/reach`,
            reach
        );

        return response;
    }

    async getReach(orderId): Promise<Reach> {
        const response = await this.apiHttpService.get(
            `order/${orderId}/reaches`
        );

        const reach = this.returnObj(response);
        return reach ? new Reach(reach) : null;
    }

    async update(id: string, order: OrderModel) {
        const response = await this.apiHttpService.put(`order/${id}`, order);
        return this.returnSuccess(response);
    }

    async updateProducts(id: string, products: ProductModel[]) {
        const response = await this.apiHttpService.put(
            `order/${id}/products`,
            products
        );

        return this.returnSuccess(response);
    }

    async processOrder(orderId: string, model: Object) {
        const response = await this.apiHttpService.put(
            `order/process/${orderId}`,
            model
        );
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async acceptHandle(orderId: string) {
        return this.returnSuccess(
            await this.apiHttpService.put(`order/${orderId}/handle`, null)
        );
    }

    async assignPartner(id: string, partnerId) {
        const response = await this.apiHttpService.put(`order/assign/${id}`, {
            servicerId: partnerId
        });
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async assignOrdersToPartner(
        orderIds: string[],
        servicerId: string,
        location: LocationModel
    ) {
        const response = await this.apiHttpService.put(`order/assign`, {
            orderIds,
            servicerId,
            location
        });
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async assignOrdersTo3PL(orderIds: string[], clientBranchId: string) {
        const response = await this.apiHttpService.put(`order/assign3PL`, {
            orderIds,
            clientBranchId
        });
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async updateTotalPackage(orderId: string, packageList) {
        const response = await this.apiDelivery.put(
            `order/${orderId}/updatePackages`,
            {
                packages: {
                    packageList
                }
            }
        );
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async updateServices(orderId: string, pointId: string, model: Object) {
        const response = await this.apiHttpService.put(
            `order/${orderId}/point/${pointId}`,
            model
        );
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async getChangeCostInUpdateServices(
        orderId: string,
        pointId: string,
        model: Object
    ) {
        const response = await this.apiHttpService.post(
            `order/${orderId}/point/${pointId}/services-cost`,
            model
        );
        return {
            success: response.errorCode === 0,
            data: response.data,
            message: response.message || ''
        };
    }

    async updateRoute(orderId: string, modal: Object) {
        const response = await this.apiHttpService.put(
            `order/${orderId}/routes`,
            modal
        );
        return {
            success: response.errorCode === 0,
            data: response.data,
            message: response.message
        };
    }

    async compare(cods: any) {
        return await this.apiHttpService.post(`cod/comparison`, cods);
    }

    public async fastCancellation(data) {
        const response = await this.apiHttpService.post(
            `order/fast-cancellation`,
            data
        );
        return this.returnSuccess(response);
    }
}
