import * as _ from 'lodash';
import { Actions } from '../../../../constants/actions';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OrderModel } from 'app/modules/order/models/order.model';
import { OrderStatus } from '@/constants/OrderStatus';
import { Profile } from '@/modules/profile/models/profile.model';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';

@Component({
  selector: 'warehouse-order-detail-services',
  templateUrl: './warehouse-order-detail-services.component.html',
  styleUrls: ['./warehouse-order-detail-services.component.less']
})
export class WarehouseOrderDetailServicesComponent implements OnChanges {
  @Input() order: OrderModel = new OrderModel();
  @Input() loading: boolean = false;
  @Input() currentUser: Profile;
  @Output() setActionType = new EventEmitter();
  Actions = Actions;
  costRent: ServiceModel = new ServiceModel();
  services: ServiceModel[] = [];

  ngOnChanges() {
    this.loading = true;
    this.getServicer();
    this.loading = false;
  }

  getServicer() {
    this.services = [];
    if (this.order && this.order.services) {
      _.forEach(this.order.services, (item) => {
        if (item.style) {
          if (item.style === ServiceStyle.Warehouse_Rent_Area) {
            this.costRent = item;
          }
          if (item.style === ServiceStyle.Warehouse_Additional) {
            this.services.push(item);
          }
        }
      });
    }
  }

  get isConfirnedSuccess() {
    return this.order.status === OrderStatus.ConfirmCompleted;
  }

  get isCompleted() {
    return this.order.status === OrderStatus.Finished;
  }

  get isWatingToComfirm() {
    return this.order.status === OrderStatus.WatingToConfirm;
  }

  get isPartnerAccepted() {
    return this.order.status === OrderStatus.Accepted;
  }

  get isCanceledByOperator() {
    return this.order.status === OrderStatus.CanceledByAdmin;
  }

  get isCanceledByRenter() {
    return this.order.status === OrderStatus.CanceledByRenter;
  }

  get isCanceledByLessor() {
    return this.order.status === OrderStatus.CanceledByLessor;
  }

  handleAction(type) {
    this.setActionType.emit(type);
  }

  showAction(type: string = null) {
    switch (type) {
      case Actions.CANCEL:
        return ![
          OrderStatus.CanceledByAdmin, OrderStatus.CanceledByLessor, OrderStatus.CanceledByRenter,
          OrderStatus.CanceledByServicer, OrderStatus.CanceledByUser, OrderStatus.Finished
        ].includes(this.order.status);
      case Actions.CONFIRM:
        return this.order.status === OrderStatus.ConfirmCompleted;
      case Actions.COMPLETE:
        return this.order.status === OrderStatus.Accepted;
    }
  }
  checkAuthority() {
    return this.currentUser && this.currentUser._id === this.order.processedBy;
  }
}
