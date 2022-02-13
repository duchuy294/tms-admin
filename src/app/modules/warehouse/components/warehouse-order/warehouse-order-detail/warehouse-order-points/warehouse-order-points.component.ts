import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderStatus } from '@/constants/OrderStatus';
import { PointModel } from 'app/modules/order/models/point.model';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';

@Component({
  selector: 'warehouse-order-points',
  templateUrl: './warehouse-order-points.component.html',
  styleUrls: ['./warehouse-order-points.component.less']
})
export class WarehouseOrderPointsComponent implements OnChanges {

  @Input() visible: boolean = false;
  @Input() user: any = null;
  @Input() host: any = null;
  @Input() order: OrderModel = null;
  @Output() handleVisiblePoints = new EventEmitter<boolean>();
  costRent: ServiceModel = new ServiceModel();
  services: ServiceModel[] = [];
  images = [];
  renterSignImage = [];
  lessorSignImage = [];
  pointDetail: PointModel = null;

  ngOnChanges() {
    this.getServicer();
    this.getImages();
    this.getPointDetail();
  }

  getServicer() {
    this.costRent = null;
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
  getImages() {
    this.images = [];
    this.renterSignImage = [];
    this.lessorSignImage = [];
    if (this.order && this.order.detail && this.order.detail.points && this.order.detail.points.length > 0) {
      this.renterSignImage.push({
        url: this.order.detail.points[0].renterSignImage,
        status: 'done'
      });
      this.lessorSignImage.push({
        url: this.order.detail.points[0].hostSignImage,
        status: 'done'
      });
      _.forEach(this.order.detail.points[0].images, (image) => {
        this.images.push({
          url: image,
          status: 'done'
        });
      });
    }
  }

  getPointDetail() {
    this.pointDetail = null;
    if (this.order.detail && this.order.detail.points) {
      this.pointDetail = this.order.detail.points[0];
    }
  }

  handleVisibleModal(flag?) {
    this.handleVisiblePoints.emit(!!flag);
  }

  cancel() {
    this.handleVisibleModal(false);
  }

  get isConfirmedSuccessOrCompleted() {
    return this.order.status === OrderStatus.ConfirmCompleted || this.order.status === OrderStatus.Finished;
  }

  get isCancelStatus() {
    return this.order.status === OrderStatus.CanceledByAdmin || this.order.status === OrderStatus.CanceledByLessor || this.order.status === OrderStatus.CanceledByRenter;
  }

}
