import * as _ from 'lodash';
import { AdminPermission } from './../../../../../constants/AdminPermissions';
import { BrandModel } from '@/modules/warranty-repair/models/brand.model';
import { BrandService } from '@/modules/warranty-repair/services/brand.service';
import { Component, OnInit } from '@angular/core';
import { ContactModel } from '@/models/contact.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { ILocation } from 'app/modules/order/models/location.model';
import { Input, NgZone } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderModel } from '../../../../../modules/order/models/order.model';
import { OrderService } from '../../../../../modules/order/services/order.service';
import { OrderStatus } from '@/constants/OrderStatus';
import { PointModel } from 'app/modules/order/models/point.model';
import { PointStatus } from 'app/modules/order/constants/PointStatus';
import { PointType } from '@/modules/order/constants/PointType';
import { ProductModel } from '@/modules/order/models/product.model';
import { ProductTypeModel } from '@/modules/warranty-repair/models/product-type.model';
import { ProductTypeService } from '@/modules/warranty-repair/services/product-type.service';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';
import { SessionService } from '@/modules/utility/services/session.service';
import { TranslateService } from '@ngx-translate/core';
import { UserType } from '@/constants/UserType';

@Component({
    selector: 'point-detail',
    templateUrl: './point-detail.component.html',
    styleUrls: ['./point-detail.component.less']
})
export class PointDetailComponent implements OnInit {
    currentModel: PointModel;
    order: OrderModel;
    productType: ProductTypeModel;
    brand: BrandModel;
    images = [];
    signImage = [];
    PointType = PointType;
    ServiceStyle = ServiceStyle;
    pointDetailModal: NzModalRef;
    PointStatus = PointStatus;
    OrderStatus = OrderStatus;
    canDisplayTime: boolean = false;
    expandingDetails = true;
    deliveryAddress: string;
    infoDeliveryOfPickupPointList: PointModel[] = [];
    pickPointExternalCode: string[] = [];
    returnExternalCode: string[] = [];
    groupReturnProductsList: { pointId: string, products: ProductModel[], externalCode?: string, contact?: ContactModel }[] = null;
    loading = false;
    location: ILocation;
    productsModel: ProductModel[] = [];

    @Input()
    set model(value: PointModel) {
        this.loading = true;
        if (value) {
            this.currentModel = value;
            if (value.productTypeId) {
                this.loadProductType();
            }
            if (value.brandId) {
                this.loadBrand();
            }
            if (value.images && value.images.length) {
                this.images = [];
                value.images.forEach(image => {
                    this.images.push({
                        url: image,
                        status: 'done'
                    });
                });
            }
            if (value.signImage) {
                this.signImage = [];
                this.signImage.push({
                    url: value.signImage,
                    status: 'done'
                });
            }
        }
        this.loading = false;
    }

    get model() {
        return this.currentModel;
    }

    get showServiceDetail() {
        return [PointType.PickUp, PointType.Delivery, PointType.Install].includes(this.currentModel.type);
    }

    @Input() products: ProductModel[] = [];
    @Input() allowedUpdate = false;
    @Input() flagUpdate = false;
    userServices: ServiceModel[] = [];

    servicesPoint: ServiceModel = null;

    async loadProductType() {
        this.productType = await this.productTypeService.get(
            this.model.productTypeId
        );
    }

    async loadBrand() {
        this.brand = await this.brandService.get(this.model.brandId);
    }

    get showEditMap() {
        const profile = this.sessionService.getCurrentUser();
        return this.allowedUpdate
            && profile.roles.includes(AdminPermission.UPDATE_LOCATION)
            && ([OrderStatus.FindingServicer, OrderStatus.Accepted, OrderStatus.InProgress].includes(this.order.status)
                || this.currentModel.status === PointStatus.PENDING);
    }

    constructor(
        public orderService: OrderService,
        private productTypeService: ProductTypeService,
        private brandService: BrandService,
        public modalService: NzModalService,
        private userService: CustomerService,
        private translateService: TranslateService,
        private messageService: NzMessageService,
        private sessionService: SessionService,
        private zone: NgZone
    ) { }

    async ngOnInit() {
        this.loading = true;
        if (this.currentModel.userIncidents && this.currentModel.userIncidents.length) {
            this.expandingDetails = false;
        }
        this.canDisplayTime = !['delivery', 'installation', 'deliveryInstallation'].includes(this.order.serviceType);
        await this.loadUserServices();
        if (this.currentModel.type === PointType.Delivery) {
            this.pickPointExternalCode = _.map(this.infoDeliveryOfPickupPointList, (item) => item.externalCode).filter(item => item);
        } else {
            if (this.currentModel.type === PointType.Return && !_.isEmpty(this.groupReturnProductsList)) {
                this.returnExternalCode = _.map(this.groupReturnProductsList, (item) => item.externalCode).filter(item => item);
            }
        }
        this.loading = false;
        this.location = _.cloneDeep(this.currentModel.location);
        if (!this.location.mapAddress) {
            this.location.mapAddress = this.currentModel.location.address;
        }
    }

    close() {
        this.modalService.closeAll();
    }

    get allowedUpdateServices() {
        return this.allowedUpdate
            && [PointType.PickUp, PointType.Delivery, PointType.Install].includes(this.currentModel.type)
            && ![PointStatus.PICKUP_SUCCESSFUL, PointStatus.INSTALLED].includes(this.currentModel.status)
            && this.order.status !== OrderStatus.FailedInstallation;
    }

    async loadUserServices() {
        if (this.order.userId) {
            let user = await this.userService.getCustomer(this.order.userId);
            if (user.type === UserType.STAFF) {
                user = await this.userService.getCustomer(user.enterpriseId);
            }
            const services = await this.userService.getServicesByUser(user._id);
            switch (this.currentModel.type) {
                case PointType.PickUp:
                    this.userServices = services.filter(x => [ServiceStyle.Delivery_Porters].includes(x.style));
                    break;

                case PointType.Install:
                    this.userServices = services.filter(x => [ServiceStyle.Installation].includes(x.style));
                    break;

                case PointType.Delivery:
                    this.userServices = services.filter(x => [ServiceStyle.Delivery_Porters, ServiceStyle.Installation].includes(x.style));
                    break;
            }
        }
    }

    async updateServices() {
        const response = await this.orderService.updateServices(this.order._id, this.currentModel.id, { services: this.currentModel.services, location: this.location, products: this.productsModel });
        if (response.success) {
            this.flagUpdate = true;
            this.messageService.success(this.translateService.instant('order.edit-successfully'));
            this.modalService.closeAll();
        } else {
            this.messageService.error(response.message);
        }
    }

    confirmUpdateService() {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmChange'),
            nzOnOk: () => this.updateServices(),
            nzCancelText: this.translateService.instant('button.cancel'),
            nzOkText: this.translateService.instant('button.confirm')
        });
    }

    updateExpand(flag: boolean = true) {
        this.expandingDetails = flag;
    }

    getMapsCenter(center) {
        this.location = {
            lat: center.lat,
            lng: center.lng,
            address: this.location.address,
            mapAddress: center.mapAddress
        };
        this.zone.run(() => { return; });
    }

    handleAutocompleteChange($event) {
        this.location.mapAddress = $event;
    }

    updateLocation($event) {
        this.location = {
            lat: $event.geometry.location.lat(),
            lng: $event.geometry.location.lng(),
            address: this.location.address,
            mapAddress: $event.formatted_address
        };
    }
}
