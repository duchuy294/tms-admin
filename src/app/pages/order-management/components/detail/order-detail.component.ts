import * as _ from 'lodash';
import { AdminPermission } from './../../../../constants/AdminPermissions';
import { AdminService } from './../../../../modules/admin/services/admin.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ContactModel } from 'app/models/contact.model';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from './../../../../modules/customer/services/customer.service';
import { NewOrderCancelComponent } from './modal/new-order-cancel/new-order-cancel.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { OperatorNoteComponent } from './../../../../modules/order/components/operator-note/operator-note.component';
import { ORDER_STATUS_COLOR } from '@/constants/OrderStatus';
import { OrderDeliveryType } from '@/constants/OrderDeliveryType';
import { OrderModalComponent } from './modal/order-modal.component';
import { OrderModel } from '../../../../modules/order/models/order.model';
import { OrderReachModalComponent } from './modal/order-reach/order-reach-modal.component';
import { OrderService } from '../../../../modules/order/services/order.service';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PaymentMethod } from '@/constants/PaymentMethod';
import { POINT_STATUS_COLOR } from './../../../../modules/order/constants/PointStatus';
import { PointDetailComponent } from './point-detail/point-detail.component';
import { PointModel } from 'app/modules/order/models/point.model';
import { PointStatus } from 'app/modules/order/constants/PointStatus';
import { PointType } from './../../../../modules/order/constants/PointType';
import { ProductModel } from '@/modules/order/models/product.model';
import { Profile } from '@/modules/profile/models/profile.model';
import { Reach } from '../../models/order-create.model';
import { SerialNumberListComponent } from './../../../../modules/order/components/modals/serial-number-list/serial-number-list.component';
import { ServiceModel } from '@/modules/price/models/service.model';
import { Servicer } from '../../../../modules/servicer/models/servicer/servicer.model';
import { ServicerService } from '../../../../modules/servicer/services/servicer.service';
import { ServicerType } from '@/constants/ServicerType';
import { SessionService } from '@/modules/utility/services/session.service';
import { StoreService } from '@/modules/warranty-repair/services/store.service';
import { TranslateService } from '@ngx-translate/core';
import { UserStatus } from '@/constants/UserStatus';
import { VehicleService } from './../../../../modules/delivery/services/vehicle.service';

@Component({
    selector: 'order-detail',
    templateUrl: 'order-detail.component.html',
    styleUrls: ['order-detail.component.less']
})
export class OrderDetailComponent implements OnChanges, OnInit {
    public servicer: Servicer;
    public user;
    public subUser;
    public admin;
    public store;
    public isLoaded = true;
    public vehicleTypes = {};
    public groupReturnProductsData: { [id: string]: { pointId: string, products: ProductModel[], externalCode?: string, contact?: ContactModel }[] } = {};
    currentUser: Profile = null;
    pointDetailModal: NzModalRef;
    @Input() order: OrderModel = null;
    @Output() onChange = new EventEmitter();
    @ViewChild('serialNumberList') serialNumberList: SerialNumberListComponent;
    @ViewChild('orderOperatorNote') orderOperatorNote: OperatorNoteComponent;
    @ViewChild('cancelOrderForm') cancelOrderForm: NewOrderCancelComponent;
    @ViewChild('mapForm') mapForm: OrderModalComponent;
    ORDER_STATUS_COLOR = ORDER_STATUS_COLOR;
    orderDeliveryType = OrderDeliveryType;
    PaymentMethod = PaymentMethod;
    visibleSerialNumberList: boolean = false;
    products: ProductModel[] = [];
    cloneProducts: ProductModel[] = [];
    loadingSerialNumberList: boolean = false;
    types = [
        OrderType.DELIVERY,
        OrderType.DELIVERY_INSTALL,
        OrderType.WARRANTY_REPAIR
    ];
    images = [];
    orderChangeRef$: any;
    orderer: Customer;
    processingStaff: any = null;
    visibleNoteForm: boolean = false;
    visibleCancelOrderForm: boolean = false;
    visibleMapForm: boolean = false;
    visibleAssignOrderForm: boolean = false;
    loadingNoteForm: boolean = false;
    loadingCancelOrderForm: boolean = false;
    loadingMapForm: boolean = false;
    _selectedServicer = null;
    WARRANTY_REPAIR = OrderType.WARRANTY_REPAIR;
    servicerSearchCondition = {
        fields: 'fullName,phone,code',
        status: UserStatus.ACTIVE,
        type: [ServicerType.Personal, ServicerType.EnterpriseStaff, ServicerType.truckHub]
    };
    tabIndex: number = 0;
    pointProducts: ProductModel[] = [];
    services: ServiceModel = null;
    lang = 'vi';
    flagExpanding: boolean = false;
    deliveryAddressList: { [_id: string]: string } = {};
    infoDeliveryOfPickupPoint: { [_id: string]: PointModel[] } = {};
    POINT_STATUS_COLOR = POINT_STATUS_COLOR;
    pointColorList: { [_id: string]: string } = {};
    indexPointsList: { [_id: string]: number } = {};
    PointType = PointType;
    PointStatus = PointStatus;
    revertOrderStatusVisible = false;

    get showRevertIcon() {
        return this.order && (![OrderStatus.Finished, OrderStatus.FinishedWithReturn].includes(this.order.status) || !this.order.cod || !this.order.cod.session)
            && this.currentUser.roles.includes(AdminPermission.REVERT_ORDER_STATUS) &&
            [OrderStatus.FailedInstallation, OrderStatus.CanceledByAdmin, OrderStatus.CanceledByServicer, OrderStatus.CanceledByUser, OrderStatus.Finished, OrderStatus.FinishedWithReturn, OrderStatus.Return].includes(this.order.status);
    }

    constructor(
        public orderService: OrderService,
        private servicerService: ServicerService,
        private userService: CustomerService,
        private adminService: AdminService,
        private ngbModal: NgbModal,
        private vehicleService: VehicleService,
        private modalService: NzModalService,
        private translateService: TranslateService,
        private storeService: StoreService,
        private messageService: NzMessageService,
        private sessionService: SessionService
    ) { }

    async ngOnChanges() {
        if (this.order) {
            await this.loadData();
        }
        if (this.order && this.order.servicerId && this.servicer) {
            this._selectedServicer = this.order.servicerId;
        }
    }

    async ngOnInit() {
        await this.getCurrentUser();
        const vehicleTypes = await this.vehicleService.getVehicleTypes(false);
        _.forEach(vehicleTypes, type => {
            this.vehicleTypes[type._id] = type;
        });
        this.lang = this.translateService.currentLang;
    }

    set selectedServicer(value) {
        if (!_.isEmpty(value) || value === null) {
            this._selectedServicer = value;
        }
    }

    get selectedServicer() {
        return this._selectedServicer;
    }

    async loadData() {
        this.isLoaded = true;
        if (_.isEmpty(this.images) && this.order.detail.images) {
            this.order.detail.images.forEach(image => {
                this.images.push({
                    uid: _.uniqueId,
                    status: 'done',
                    url: image
                });
            });
        }
        if (this.order.servicerId) {
            this.servicer = await this.servicerService.get(
                this.order.servicerId
            );
        }
        if (this.order.adminId && !this.admin) {
            this.admin = await this.adminService.getAdmin(this.order.adminId);
        }
        if (
            this.order.serviceType === OrderType.WARRANTY_REPAIR &&
            this.order.detail.points.length &&
            this.order.detail.points[0].storeId
        ) {
            this.store = await this.storeService.get(
                this.order.detail.points[0].storeId
            );
        }
        if (!this.user) {
            this.user = await this.userService.getCustomer(this.order.userId);
        }
        if (!this.subUser && this.order.clientBranchId) {
            this.subUser = await this.userService.getCustomer(this.order.clientBranchId);
        }
        this.products = this.order.products ? this.order.products : [];
        this.cloneProducts = _.cloneDeep(this.products);
        await this.getOrderer();
        await this.getAdmin();
        this.getExternalCodeProductsForPoints();
        this.isLoaded = false;
    }

    getExternalCodeProductsForPoints() {
        let indexColor = 0;
        let deliveryIndex = 1;
        let pickpointIndex = 1;
        let returnIndex = 1;
        const mappingInformationPoint = _.keyBy(_.filter(this.order.detail.points, (item) => item.type === PointType.Delivery), (item) => item.id);
        _.forEach(this.order.detail.points, (item) => {
            if (item.type === PointType.Delivery) {
                if (this.infoDeliveryOfPickupPoint.hasOwnProperty(item.pickPointId)) {
                    this.infoDeliveryOfPickupPoint[item.pickPointId].push(item);
                } else {
                    this.infoDeliveryOfPickupPoint[item.pickPointId] = [item];
                }
                this.indexPointsList[item.id] = deliveryIndex;
                ++deliveryIndex;
            } else {
                if (item.type === PointType.PickUp) {
                    this.deliveryAddressList[item.id] = item.location.address;
                    this.pointColorList[item.id] = this.POINT_STATUS_COLOR[indexColor % POINT_STATUS_COLOR.length];
                    ++indexColor;
                    this.indexPointsList[item.id] = pickpointIndex;
                    ++pickpointIndex;
                } else {
                    if (item.type === PointType.Return) {
                        this.indexPointsList[item.id] = returnIndex;
                        ++returnIndex;
                        if (!_.isEmpty(item.products)) {
                            this.groupReturnProductsData[item.id] = _.chain(item.products).groupBy('pointId').map((value, key) => ({ 'pointId': key, 'products': value })).value();
                            if (!_.isEmpty(mappingInformationPoint)) {
                                _.forEach(this.groupReturnProductsData[item.id], (product) => {
                                    if (product.pointId && !_.isEmpty(mappingInformationPoint[product.pointId])) {
                                        product['externalCode'] = mappingInformationPoint[product.pointId].externalCode;
                                        product['contact'] = mappingInformationPoint[product.pointId].contact;
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
        _.forEach(this.infoDeliveryOfPickupPoint, (value, key) => {
            this.infoDeliveryOfPickupPoint[key] = _.uniqBy(value, 'id');
        });
    }

    openModal() {
        this.handleVisibleMapForm(true);
    }

    openReachesModal() {
        const orderModal = this.ngbModal.open(OrderReachModalComponent, {
            size: 'lg',
            windowClass: 'modal-85-percent'
        }).componentInstance as OrderReachModalComponent;
        orderModal.order = this.order;
    }

    changePerformer() {
        this.visibleAssignOrderForm = true;
    }

    cancelChangePerformer() {
        if (!this.order.servicerId) {
            this._selectedServicer = null;
        }
        this.visibleAssignOrderForm = false;
    }

    async updateReach(servicers: Servicer[]) {
        const response = await this.orderService.updateReach(
            this.order._id,
            new Reach({ summary: _.map(servicers, x => x._id) })
        );
        if (response) {
            this.order = await this.orderService.get(this.order._id);
        }
        if (response.errorCode !== 0) {
            this.modalService.error({ nzTitle: response.message });
        }
        return true;
    }

    getPointDetailTitle(order: OrderModel, pointNumer: number, point: PointModel = null) {
        if (point && point.type) {
            if ([PointType.Delivery, PointType.PickUp, PointType.Return].includes(point.type)) {
                return `${this.translateService.instant('order.information-point')} ${this.translateService.instant(`order.information-type-status.${point.type}`)} ${this.indexPointsList[point.id]}`;
            }
        }
        if (order.serviceType === OrderType.WARRANTY_REPAIR) {
            return 'Thông tin điểm bảo hành sửa chữa';
        } else if (order.serviceType === OrderType.INSTALL) {
            return 'Thông tin điểm lắp đặt';
        }
        return `Thông tin điểm ${pointNumer} `;
    }

    async showPointDetail(point: PointModel, pointNumer: number = 1) {
        const modelTitle = this.getPointDetailTitle(this.order, pointNumer, point);
        let pointStatus = null;
        if (point.status !== PointStatus.COMPLETE_LATER) {
            pointStatus = `${this.translateService.instant(`order.pointStatus.${point.status}`)}`;
        } else {
            pointStatus = `${this.translateService.instant(`order.pointStatus.${point.status}.${point.type}`)}`;
        }
        pointStatus = pointStatus.toLowerCase();
        pointStatus = pointStatus.charAt(0).toUpperCase() + pointStatus.slice(1);
        const flagUpdateParam = false;
        this.pointDetailModal = this.modalService.create({
            nzWidth: 800,
            nzTitle: `${modelTitle} <span class='point-status'>(${pointStatus})<span>`,
            nzContent: PointDetailComponent,
            nzClassName: 'point-detail',
            nzComponentParams: {
                order: _.cloneDeep(this.order),
                deliveryAddress: (PointType.Delivery === point.type && point.pickPointId) ? _.cloneDeep(this.deliveryAddressList[point.pickPointId]) : null,
                infoDeliveryOfPickupPointList: (point.type === PointType.PickUp) ? _.cloneDeep(this.infoDeliveryOfPickupPoint[point.id]) : [],
                model: _.cloneDeep(point),
                products: _.cloneDeep(this.pointProducts),
                groupReturnProductsList: (point.type === PointType.Return && !_.isEmpty(this.groupReturnProductsData)) ? _.cloneDeep(this.groupReturnProductsData[point.id]) : null,
                allowedUpdate: this.checkAllowedUpdateservices(),
                flagUpdate: flagUpdateParam
            },
            nzFooter: null
        });
        if (flagUpdateParam) {
            this.pointDetailModal.afterClose.subscribe(() =>
                this.reloadOrder()
            );
        }
    }

    async updateAdminNote() {
        this.orderService.update(this.order._id, new OrderModel({ adminNote: this.order.adminNote }));
    }

    handleVisibleSerialNumberList(flag: boolean) {
        this.visibleSerialNumberList = !!flag;
        if (!flag) {
            this.cloneProducts = _.cloneDeep(this.products);
            this.serialNumberList.reset(this.cloneProducts);
        }
    }

    updateProduct(data: ProductModel[] = []) {
        this.products = data;
        this.order.products = data;
    }

    onUpdateProducts(event) {
        if (event) {
            if (event.response) {
                this.updateProduct(event.data);
                this.messageService.success(
                    this.translateService.instant(
                        'order.serialNumber-status.update-complete'
                    )
                );
                this.handleVisibleSerialNumberList(false);
            }
        }
        this.handleLoadingSerialNumberList(false);
    }

    handleLoadingSerialNumberList(flag: boolean) {
        this.loadingSerialNumberList = !!flag;
    }

    async getOrderer() {
        if (this.order && this.order.operatorId) {
            this.orderer = await this.userService.getCustomer(
                this.order.operatorId
            );
        }
    }

    async getAdmin() {
        if (this.order.processedBy) {
            this.processingStaff = await this.adminService.getAdmin(
                this.order.processedBy
            );
        }
    }

    async getCurrentUser() {
        this.currentUser = this.sessionService.getCurrentUser();
    }

    handleVisible(flag = true) {
        this.visibleNoteForm = !!flag;
        if (!flag) {
            this.orderOperatorNote.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingNoteForm = !!flag;
    }

    handleLoadingCancelOrder(flag = true) {
        this.loadingCancelOrderForm = !!flag;
    }

    handleLoadingMap(flag = true) {
        this.loadingMapForm = !!flag;
    }

    submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    'warehouse.warehouse-order.successful-edit-operator'
                )
            );
            if (this.order) {
                this.order.adminNote = $event.data;
            }
        } else {
            this.messageService.error('');
        }
        this.handleLoading(false);
    }

    displayNoteAdmin() {
        this.handleVisible(true);
    }

    get getProcessingTimeout() {
        return OrderStatus.ProcessingTimeout;
    }

    get getProcessedTimeout() {
        return OrderStatus.ProcessedTimeout;
    }

    get getTimeout() {
        return OrderStatus.Timeout;
    }

    get checkProcessingTimeout() {
        return this.order.status === OrderStatus.ProcessingTimeout;
    }

    get checkTimeout() {
        return this.order.status === OrderStatus.Timeout;
    }

    handleNoteAdmin() {
        this.handleVisible(true);
    }

    async operateTimeout() {
        const response = await this.orderService.processOrder(this.order._id, {
            action: OrderStatus.ProcessingTimeout
        });
        if (response.success) {
            this.messageService.success(
                this.translateService.instant('common.successfully')
            );
            this.onChange.emit();
        } else {
            this.messageService.error(response.message);
        }
    }
    async operatePocessingTimeout() {
        const response = await this.orderService.processOrder(this.order._id, {
            action: OrderStatus.ProcessedTimeout
        });
        if (response.success) {
            this.messageService.success(
                this.translateService.instant('common.successfully')
            );
            this.onChange.emit();
        } else {
            this.messageService.error(response.message);
        }
    }

    async reloadOrder() {
        this.order = await this.orderService.get(this.order._id);
        await this.loadData();
    }

    async processingAssignPartner(selectedServicer: string = null) {
        this.isLoaded = true;
        if (selectedServicer === null) {
            this.messageService.error(
                this.translateService.instant('order.validate-assign-partner')
            );
        }
        const response = await this.orderService.assignPartner(
            this.order._id,
            selectedServicer
        );
        if (response.success) {
            this.messageService.success(
                this.translateService.instant('common.successfully')
            );
            await this.reloadOrder();
        } else {
            this.messageService.error(response.message);
        }
        this.isLoaded = false;
        this.visibleAssignOrderForm = false;
    }

    onChangeTab() {
        this.tabIndex = 1 - this.tabIndex;
    }

    displayCancelButton() {
        return (
            this.order &&
            ![
                OrderStatus.Finished,
                OrderStatus.FinishedWithReturn,
                OrderStatus.CanceledByUser,
                OrderStatus.CanceledByServicer,
                OrderStatus.CanceledByAdmin,
                OrderStatus.Timeout,
                OrderStatus.ProcessedTimeout,
                OrderStatus.ProcessingTimeout,
                OrderStatus.FailedInstallation,
                OrderStatus.Incident,
                OrderStatus.ProcessingIncident
            ].includes(this.order.status) &&
            this.checkAuthority()
        );
    }
    checkAuthority() {
        return (
            this.currentUser && this.currentUser._id === this.order.processedBy
        );
    }
    displayChangePerformer() {
        return (
            this.order.serviceType !== OrderType.WARRANTY_REPAIR &&
            [OrderStatus.New,
            OrderStatus.FindingServicer,
            OrderStatus.Accepted,
            OrderStatus.ProcessingTimeout,
            OrderStatus.PendingReturned,
            ].includes(this.order.status) &&
            this.checkAuthority()
        );
    }

    handleVisibleCancelOrderForm(flag = true) {
        this.visibleCancelOrderForm = flag;
        if (!flag) {
            this.cancelOrderForm.reset();
        }
    }

    handleVisibleMapForm(flag = true) {
        this.visibleMapForm = flag;
        if (!flag) {
            this.mapForm.reset();
        }
    }

    checkOrderStatusInAllowedUpdate() {
        return (
            this.order &&
            ![
                OrderStatus.Finished,
                OrderStatus.FinishedWithReturn,
                OrderStatus.Incident,
                OrderStatus.ProcessingIncident,
                OrderStatus.CanceledByUser,
                OrderStatus.CanceledByServicer,
                OrderStatus.CanceledByAdmin,
                OrderStatus.Timeout,
                OrderStatus.ProcessedTimeout,
                OrderStatus.ProcessingTimeout
            ].includes(this.order.status) &&
            this.checkAuthority()
        );
    }

    checkAllowedUpdateservices() {
        return [OrderType.DELIVERY, OrderType.DELIVERY_INSTALL, OrderType.INSTALL].includes(this.order.serviceType) && this.checkOrderStatusInAllowedUpdate();
    }

    checkAllowedUpdateRoute() {
        return [OrderType.INSTALL, OrderType.WARRANTY_REPAIR].includes(this.order.serviceType) && this.checkOrderStatusInAllowedUpdate();
    }

    async acceptHandle() {
        if (await this.orderService.acceptHandle(this.order._id)) {
            this.order.processedBy = this.currentUser._id;
        }
    }
    displayRetry() {
        return this.order.status === OrderStatus.PendingReturned && this.checkAuthority();
    }

    formatNumber(num) {
        const _number = parseFloat(num);
        if (_.isInteger(_number)) {
            return _number;
        }
        if (_.isInteger((_number * 100) % 10)) {
            return _number;
        }
        return _number.toFixed(3);
    }
}
