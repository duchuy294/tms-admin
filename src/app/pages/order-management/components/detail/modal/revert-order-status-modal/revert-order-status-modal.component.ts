import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderModel } from 'app/modules/order/models/order.model';
import { OrderReversionService } from '@/modules/delivery/services/order-reversion.service';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PointType } from 'app/modules/order/constants/PointType';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'revert-order-status-modal',
    templateUrl: './revert-order-status-modal.component.html'
})
export class ReverOrderStatusModalComponent implements OnChanges {
    @ViewChild('revertStatusOrderForm') reasonModel: NgForm;

    @Input() order: OrderModel = null;
    @Input() visible: boolean = false;

    OrderType = OrderType;
    PointType = PointType;
    isProcessing: boolean = false;
    prevStatus = null;
    reason: string;

    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter();

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private orderReversionService: OrderReversionService) { }

    ngOnChanges() {
        if (this.visible && !this.isProcessing) {
            this.init();
        }
    }

    init() {
        if (this.order) {
            this.prevStatus = this.getPrevStatus();
        }
    }

    getPrevStatus() {
        switch (this.order.status) {
            case OrderStatus.Return:
                return OrderStatus.Pending;

            case OrderStatus.CanceledByAdmin:
            case OrderStatus.CanceledByServicer:
            case OrderStatus.CanceledByUser:
            case OrderStatus.FailedInstallation:
                return this.order.servicerId ? OrderStatus.Accepted : OrderStatus.New;

            case OrderStatus.Finished:
                return this.order.serviceType === OrderType.INSTALL ? OrderStatus.Accepted : OrderStatus.InProgress;

            case OrderStatus.FinishedWithReturn:
                return OrderStatus.PendingReturned;

            default:
                return null;
        }
    }

    async update() {
        if (this.isProcessing) {
            return;
        }
        if (this.reasonModel.valid && !_.isEmpty(this.reasonModel)) {
            this.isProcessing = true;
            const response = await this.orderReversionService.revertOrderStatus([this.order.code], this.reason);
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.messageService.success(`${this.translateService.instant('common.successfully').toLowerCase()}`);
                this.afterSubmit.emit();
                this.reset();
                this.handleVisibleModal(false);
            } else {
                this.messageService.error(response.message);
            }
        } else {
            CommonHelper.validateForm(this.reasonModel);
            this.messageService.warning(this.translateService.instant('common.invalid-data'));
        }
    }

    reset() {
        CommonHelper.resetForm(this.reasonModel);
    }

    cancel() {
        this.reset();
        this.handleVisibleModal(false);
    }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(flag);
    }
}
