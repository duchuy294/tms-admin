import * as _ from 'lodash';
import { AdminPermission } from '@/constants/AdminPermissions';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LoadingServicesComponent } from './../loading-services/loading-services.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { PointModel } from '@/modules/order/models/point.model';
import { PointType } from '@/modules/order/constants/PointType';
import { ServiceModel } from '@/modules/price/models/service.model';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';
import { SessionService } from '@/modules/utility/services/session.service';

@Component({
    selector: 'point-service',
    templateUrl: 'point-service.component.html',
    styleUrls: ['point-service.component.less']
})
export class PointServiceComponent {
    @Input() userServices: ServiceModel[] = [];
    @Input() expandingDetails: boolean = true;
    @Input() order: OrderModel;
    @Input() allowedUpdateServices = false;
    @Input() point: PointModel;
    @Output() updateExpand = new EventEmitter<boolean>();
    @ViewChild('serviceForm') serviceForm: LoadingServicesComponent;
    currentUser = this.sessionService.getCurrentUser();

    get checkShowDetails() {
        return [
            PointType.PickUp,
            PointType.Delivery,
            PointType.Install
        ].includes(this.point.type);
    }

    ServiceStyle = ServiceStyle;
    unitServices: { [_id: string]: Number } = {};
    visibleServiceForm = false;
    loadingServiceForm = false;
    servicesPoint: ServiceModel;

    constructor(
        private messageService: NzMessageService,
        public orderService: OrderService,
        public sessionService: SessionService
    ) { }

    getServiceValue(service: ServiceModel) {
        if (service.unit) {
            return service.unit;
        }
        switch (service.style) {
            case ServiceStyle.Delivery:
            case ServiceStyle.Delivery_Return:
                return service.distance;

            case ServiceStyle.Delivery_Collection:
                return service.price;

            case ServiceStyle.Installation:
            case ServiceStyle.Installation_AddonService:
            case ServiceStyle.Delivery_Porters:
                return service.quantity;

            case ServiceStyle.Delivery_Stopoint:
                return 1;

            default:
                return null;
        }
    }

    async triggerServicesChange() {
        const response = await this.orderService.getChangeCostInUpdateServices(
            this.order._id,
            this.point.id,
            { services: this.point.services }
        );
        if (response.success) {
            this.point.userCost = response.data.userCost;
            this.point.realCost = response.data.realCost;
            this.point.paid = response.data.paid;
        } else {
            this.messageService.error(response.message);
        }
    }

    async removeServices(service: ServiceModel) {
        if (_.remove(this.point.services, s => s === service).length === 0) {
            for (let index = 0; index < this.point.services.length; index++) {
                const parentService = this.point.services[index];
                if (parentService.children && parentService.children.length) {
                    if (_.remove(parentService.children, s => s === service).length) {
                        break;
                    }
                }
            }
        }

        _.remove(this.point.services, s => [ServiceStyle.Installation, ServiceStyle.Delivery_Porters].includes(s.style) && (!s.children || s.children.length === 0));

        await this.triggerServicesChange();
    }

    handleVisibleServiceForm(flag = true) {
        this.visibleServiceForm = !!flag;
        if (!flag) {
            this.serviceForm.reset();
        }
    }

    handleLoadingServiceForm(flag = true) {
        this.loadingServiceForm = !!flag;
    }

    async submitServiceForm(services: ServiceModel[]) {
        this.handleVisibleServiceForm(false);
        _.forEach(services, _service => {
            _.assignIn(_service, {
                quantity: 1,
                cost: _service.price
            });
            let parent = _.find(
                this.point.services,
                x => x.style === _service.style
            );
            if (parent) {
                const service = _.find(
                    parent.children,
                    x => x._id === _service._id
                );
                if (service) {
                    service.quantity++;
                    service.cost = service.price * service.quantity;
                } else {
                    if (parent && parent.children) {
                        parent.children.push(_service);
                    }
                }
            } else {
                const originalParent = _.find(
                    this.userServices,
                    x => x.style === _service.style
                );
                parent = new ServiceModel({
                    _id: originalParent._id,
                    style: _service.style,
                    type: originalParent.type,
                    name: originalParent.name,
                    children: [_service]
                });
                if (this.point && this.point.services) {
                    this.point.services.push(parent);
                }
            }
            parent.quantity = _.sumBy(parent.children, x => x.quantity);
            parent.cost = _.sumBy(parent.children, x => x.cost);
        });
        await this.triggerServicesChange();
        this.serviceForm.reset();
    }

    canUpdateService(service: ServiceModel) {
        return this.allowedUpdateServices && this.canUpdateCOD(service)
            && [ServiceStyle.Delivery_Collection, ServiceStyle.Delivery_Porters, ServiceStyle.Installation].includes(service.style);
    }

    canUpdateCOD(service: ServiceModel) {
        return service.style === ServiceStyle.Delivery_Collection && this.currentUser.roles.includes(AdminPermission.UPDATE_COD);
    }

    async updateServiceQuantity(service: ServiceModel) {
        service.cost = service.quantity * service.price;
        await this.triggerServicesChange();
    }

    handleVisibleDetail(flag: boolean = true) {
        this.expandingDetails = !flag;
        this.updateExpand.emit(this.expandingDetails);
    }
}
