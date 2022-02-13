import * as _ from 'lodash';
import { AccountModel } from 'app/modules/admin/models/admin.model';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ILocation } from 'app/modules/order/models/location.model';
import { ISelection } from './../../../../../modules/utility/models/filter.model';
import { LocationModel } from '@/models/location.model';
import { Marker } from '../../../../../modules/utility/components/maps/models/maps.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ORDER_STATUS_COLOR } from '@/constants/OrderStatus';
import { OrderCancelComponent } from './order-cancel/order-cancel.component';
import { OrderDeleteMarkerComponent } from './order-delete-marker/order-delete-marker.component';
import { OrderMapComponent } from './../../order-map/order-map.component';
import { OrderModel } from '../../../../../modules/order/models/order.model';
import { OrderRefundComponent } from './order-refund/order-refund.component';
import { OrderService } from './../../../../../modules/order/services/order.service';
import { OrderSkipMarkerComponent } from './order-skip-marker/order-skip-marker.component';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PointModel } from 'app/modules/order/models/point.model';
import { PointType } from './../../../../../modules/order/constants/PointType';
import { Servicer } from 'app/modules/servicer/models/servicer/servicer.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'order-modal',
    templateUrl: './order-modal.component.html',
    styleUrls: ['./order-modal.component.less']
})
export class OrderModalComponent implements OnInit, OnChanges {
    @ViewChild('editRoute') editRoute: NgForm;
    @ViewChild('map') map: OrderMapComponent;
    @Input() order: OrderModel = null;
    @Input() servicer: Servicer;
    @Input() admin: AccountModel;
    @Input() allowUpdate: Boolean;
    @Input() visible: boolean = false;

    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() handleLoading = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter();

    orderModal: OrderModel = null;
    appliedBorder: Boolean = true;
    public current: ILocation;
    public deliveryPoints: PointModel[];
    public deliveryPointsSelection: ISelection[] = [];
    OrderType = OrderType;
    showLocationExplain: boolean = false;

    base: Marker;
    completed: Marker[] = [];
    processing: Marker[] = [];
    ORDER_STATUS_COLOR = ORDER_STATUS_COLOR;
    dislayTitle: Boolean = false;
    loadingModal: boolean = false;

    constructor(
        private ngbModal: NgbModal,
        private translate: TranslateService,
        public orderService: OrderService,
        private messageService: NzMessageService
    ) { }

    async ngOnInit() {
        this.loadingModal = true;
        this.deliveryPoints = _.filter(
            this.orderModal.detail.points,
            x => x.type === PointType.Delivery
        );
        this.updateData();
        this.generateDeliveryPointsSelection();
        this.loadingModal = false;
    }

    async ngOnChanges() {
        this.loadingModal = true;
        this.orderModal = _.cloneDeep(this.order);
        this.loadingModal = false;
    }

    updateData() {
        const pickPoint = _.find(
            this.orderModal.detail.points,
            x => x.type === PointType.PickUp
        );
        if (pickPoint) {
            this.base = this.mapping(pickPoint.location);
            const completed = this.deliveryPoints.filter(
                item => item.status !== 0
            );
            completed.forEach(item => {
                this.completed.push(this.mapping(item.location));
            });
            const processing = this.deliveryPoints.filter(
                item => item.status === 0
            );
            processing.forEach(item => {
                this.processing.push(this.mapping(item.location));
            });
        }
    }

    mapping(item: ILocation): Marker {
        return { lat: item.lat, lng: item.lng, address: item.address };
    }

    generateDeliveryPointsSelection() {
        const temp: { _id?: string; name?: string; completed?: boolean }[] = [];
        const content = this.translate.instant(`order.points.number`);
        let index = 1;
        this.deliveryPoints.forEach(item => {
            temp.push({
                _id: item.id,
                name: `${content}${index}`,
                completed: item.status === 1
            });
            index++;
        });
        temp.forEach(item => {
            if (!item.completed) {
                this.deliveryPointsSelection.push({
                    _id: item._id,
                    name: item.name
                });
            }
        });
    }

    showRefund() {
        this.ngbModal.open(OrderRefundComponent, { size: 'lg' });
    }

    showCancel() {
        const modal = this.ngbModal.open(OrderSkipMarkerComponent, {
            size: 'lg'
        }).componentInstance as OrderSkipMarkerComponent;
        modal.deliveryPoints = this.deliveryPointsSelection;
        modal.orderId = this.orderModal._id;
    }

    showDelete() {
        const modal = this.ngbModal.open(OrderDeleteMarkerComponent, {
            size: 'lg'
        }).componentInstance as OrderDeleteMarkerComponent;
        modal.deliveryPoints = this.deliveryPointsSelection;
        modal.orderId = this.orderModal._id;
    }

    async cancelOrder() {
        const modal = this.ngbModal.open(OrderCancelComponent, { size: 'lg' })
            .componentInstance as OrderCancelComponent;
        modal.id = this.orderModal._id;
    }

    close() {
        this.handleVisible.emit(false);
    }

    checkNewButtons() {
        return [OrderType.INSTALL, OrderType.WARRANTY_REPAIR].includes(
            this.orderModal.serviceType
        );
    }

    handleAutocompleteChange($event) {
        this.orderModal.detail.points[0].location = new ILocation();
        this.orderModal.detail.points[0].location.address = $event;
    }

    updateLocation($event) {
        this.orderModal.detail.points[0].location = new LocationModel({
            latitude: $event.geometry.location.lat(),
            longitude: $event.geometry.location.lng(),
            lat: $event.geometry.location.lat(),
            lng: $event.geometry.location.lng()
        });
        this.orderModal.detail.points[0].location.address =
            $event.formatted_address;
        this.map.reloadMap();
    }

    reset() {
        this.showLocationExplain = false;
        CommonHelper.resetForm(this.editRoute);
    }

    cancel() {
        this.reset();
        this.handleVisibleModal(false);
    }

    handleVisibleModal(flag?) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag?) {
        this.handleLoading.emit(!!flag);
    }

    validLocation() {
        return (
            this.orderModal.detail.points[0].location &&
            this.orderModal.detail.points[0].location.lat &&
            this.orderModal.detail.points[0].location.lng
        );
    }

    async updateRoutes() {
        if (this.loadingModal) {
            return;
        }
        if (this.editRoute.valid && this.valid()) {
            this.loadingModal = true;
            const points = [];
            points.push({
                location: this.orderModal.detail.points[0].location,
                id: this.orderModal.detail.points[0].id
            });
            const response = await this.orderService.updateRoute(
                this.order._id,
                { points: points }
            );
            this.loadingModal = false;
            if (response.success) {
                this.afterSubmit.emit();
                this.handleVisible.emit(false);
                this.messageService.success(
                    `${this.translate
                        .instant('common.successfully')
                        .toLowerCase()}`
                );
                this.reset();
            } else {
                this.messageService.error(response.message);
                this.messageService.warning(
                    this.translate.instant('common.invalid-data')
                );
            }
        } else {
            CommonHelper.validateForm(this.editRoute);
            this.messageService.warning(
                this.translate.instant('common.invalid-data')
            );
        }
    }

    valid() {
        this.showLocationExplain = !this.validLocation();
        return this.editRoute.valid && this.validLocation();
    }
}
