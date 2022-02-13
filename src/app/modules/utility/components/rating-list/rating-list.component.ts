import * as _ from 'lodash';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
  } from '@angular/core';
import { OrderService } from '@/modules/order/services/order.service';
import { PagingModel } from '../paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { RatingModel } from '@/modules/order/models/rating.model';
import { RatingService } from '@/modules/order/services/rating.service';

@Component({
  selector: 'rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.less']
})
export class RatingListComponent implements OnChanges {
  @Input() visible: boolean = true;
  @Input() userType: string = '';
  @Input() userId: string = '';
  @Output() handleVisible: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tableData = new PagingModel<RatingModel>();
  loading: boolean = false;
  queryModel: QueryModel = new QueryModel();
  orderCode: { [_id: string]: string } = {};

  constructor(
    private orderService: OrderService,
    private ratingService: RatingService
  ) { }

  async ngOnChanges() {
    if (this.visible) {
      delete this.queryModel.servicerId;
      delete this.queryModel.userId;
      if (this.userId) {
        this.queryModel[`${this.userType}Id`] = this.userId;
        this.queryModel.type = this.userType;
        this.queryModel.page = 1;
        await this.loadData();
      }
    }
  }

  async getOrderCode(data: PagingModel<RatingModel>) {
    const orderId = _.map(data.data, rating => rating.orderId).join(',');
    const response = await this.orderService.getOrders(new QueryModel({ orderId, fields: 'code' }));
    return response.data;
  }

  async loadData() {
    this.loading = true;
    this.tableData = await this.ratingService.filter(this.queryModel);
    const response = await this.getOrderCode(this.tableData);
    response.forEach(item => {
      this.orderCode[item._id] = item.code;
    });
    this.loading = false;
  }

  handleVisibleModal(flag = true) {
    this.handleVisible.emit(flag);
  }

  async loadDataByPage($event) {
    this.queryModel.page = $event;
    await this.loadData();
  }

  async loadDataByPageSize($event) {
    this.queryModel.limit = $event;
    this.queryModel.page = 1;
    await this.loadData();
  }
}
