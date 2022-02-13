import * as _ from 'lodash';
import { AccountType } from '@/constants/AccountType';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderDetailService } from '@/pages/order-management/service/order-detail.service';
import { OrderModel } from 'app/modules/order/models/order.model';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PointStatus } from '@/modules/order/constants/PointStatus';
import { PointType } from 'app/modules/order/constants/PointType';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'new-order-cancel',
  templateUrl: './new-order-cancel.component.html'
})
export class NewOrderCancelComponent implements OnChanges {
  @ViewChild('orderCancel') orderCancel: NgForm;

  @Input() order: OrderModel = null;
  @Input() visible: boolean = false;
  @Input()
  set loading(value: boolean) {
    this.loadingCancelOrder = value;
  }

  userCancel = [AccountType.USER, AccountType.SERVICER];
  OrderType = OrderType;
  PointType = PointType;
  visibleCancelOrder: boolean = false;
  loadingCancelOrder: boolean = false;
  isProcessing: boolean = false;
  model: OrderModel = null;

  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() handleLoading = new EventEmitter<boolean>();
  @Output() afterSubmit = new EventEmitter();

  constructor(
    private messageService: NzMessageService,
    private translateService: TranslateService,
    public orderDetailService: OrderDetailService) { }

  ngOnChanges() {
    if (this.visible && !this.isProcessing) {
      this.init();
    }
  }

  init() {
    if (this.order) {
      this.model = _.cloneDeep(this.order);
    }
  }

  async update() {
    if (this.isProcessing) {
      return;
    }
    if (this.model.cancelReason) {
      this.model.cancelReason = this.model.cancelReason.trim();
    }
    this.handleLoadingModal(true);
    if (this.orderCancel.valid && this.model && !_.isEmpty(this.model.cancelReason) && (this.model.serviceType === OrderType.INSTALL ||
      ((this.model.serviceType === OrderType.DELIVERY || this.model.serviceType === OrderType.DELIVERY_INSTALL) && !this.isPickedUpOrder(this.model))
      || !_.isEmpty(this.model.cancelBy))) {
      this.isProcessing = true;
      const modelData = { 'cancelReason': this.model.cancelReason };
      if (this.model.cancelBy) {
        modelData['cancelBy'] = this.model.cancelBy;
      }
      const response = await this.orderDetailService.deleteOrder(this.model._id, modelData);
      if (response.errorCode === 0) {
        this.handleVisibleModal(false);
        this.messageService.success(`${this.translateService.instant('common.successfully').toLowerCase()}`);
        this.afterSubmit.emit();
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
      this.isProcessing = false;
    } else {
      CommonHelper.validateForm(this.orderCancel);
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  reset() {
    CommonHelper.resetForm(this.orderCancel);
  }

  isPickedUpOrder(order: OrderModel = null) {
    if (order === null) {
      order = this.model;
    }
    const pickedUpPoint = _.find(order.detail.points, (x) => x.type === PointType.PickUp);
    return pickedUpPoint && pickedUpPoint.status === PointStatus.PICKUP_SUCCESSFUL;
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  handleVisibleModal(flag = false) {
    this.handleVisible.emit(!!flag);
  }

  handleLoadingModal(flag = false) {
    this.handleLoading.emit(!!flag);
  }
}
