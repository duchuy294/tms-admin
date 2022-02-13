import * as _ from 'lodash';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CustomerService } from 'app/modules/customer/services/customer.service';
import { ORDER_STATUS_COLOR } from '@/constants/OrderStatus';
import { OrderModel } from 'app/modules/order/models/order.model';
import { PointModel } from 'app/modules/order/models/point.model';
import { Profile } from '@/modules/profile/models/profile.model';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';
import { WarehouseOrderHistoryComponent } from './../../warehouse-order-history/warehouse-order-history.component';

@Component({
  selector: 'warehouse-order-detail-information',
  templateUrl: './warehouse-order-detail-information.component.html',
  styleUrls: ['./warehouse-order-detail-information.component.less']
})
export class WarehouseOrderDetailInformationComponent implements OnChanges {
  @Input() order: OrderModel;
  @Input() loading: boolean = false;
  @Output() noteAdmin = new EventEmitter();
  @Output() displayPoints = new EventEmitter<OrderModel>();
  @Input() currentUser: Profile;
  @ViewChild('history') history: WarehouseOrderHistoryComponent;
  user: any = null;
  processedStaff: any = null;
  host: any = null;
  pointDetail: PointModel = null;
  rentArea: number = null;
  ORDER_STATUS_COLOR = ORDER_STATUS_COLOR;
  visiblePoints: boolean = false;

  constructor(
    public userService: CustomerService,
    public adminService: AdminService) { }

  async ngOnChanges() {
    this.loading = true;
    if (this.order) {
      if (this.order.userId) {
        this.user = await this.userService.getCustomer(this.order.userId);
      }
      if (this.order.hostId) {
        this.host = await this.userService.getCustomer(this.order.hostId);
      }
      if (this.order.processedBy) {
        this.processedStaff = await this.adminService.getAdmin(this.order.processedBy);
      }

      this.pointDetail = null;
      if (this.order.detail && this.order.detail.points) {
        this.pointDetail = this.order.detail.points[0];
      }

      this.rentArea = null;
      if (this.order && this.order.services) {
        _.forEach(this.order.services, (item) => {
          if (item.style) {
            if (item.style === ServiceStyle.Warehouse_Rent_Area) {
              this.rentArea = item.quantity;
            }
          }
        });
      }
    }
    this.loading = false;
  }

  handleNoteAdmin() {
    this.noteAdmin.emit();
  }

  handleVisiblePoints(flag = true) {
    this.visiblePoints = !!flag;
  }

  async loadHistory() {
    await this.history.loadData();
  }
  checkAuthority() {
    return this.currentUser && this.currentUser._id === this.order.processedBy;
  }
}
