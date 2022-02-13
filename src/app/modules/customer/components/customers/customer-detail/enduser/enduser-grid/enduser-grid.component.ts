import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EndUser } from '@/modules/customer/models/enduser-detail.model';
import { EndUserService } from '@/modules/customer/services/enduser.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';

@Component({
  selector: 'enduser-grid',
  templateUrl: './enduser-grid.component.html'
})
export class EnduserGridComponent implements OnInit {
  loadingGrid: boolean = false;
  loadingStatus: boolean = false;
  public enduserData = new PagingModel<EndUser>();
  @Output() modify = new EventEmitter<string>();
  @Output() createSubEndUser = new EventEmitter<String>();
  userId = this.route.snapshot.paramMap.get('id');
  queryModel: QueryModel = new QueryModel({ userId: this.userId });
  statuses: { [_id: string]: boolean } = {};
  setState: any;

  constructor(
    private enduserService: EndUserService,
    private route: ActivatedRoute,
  ) { }
  ngOnInit() {
    this.loadData();
  }

  async triggerLoadData(queryModel: QueryModel, pageIndex: number = 1) {
    if (queryModel) {
      this.queryModel = queryModel;
    }
    await this.loadData(pageIndex);
  }
  async loadData(query = null, page = null) {
    if (query) {
      this.queryModel = new QueryModel(query);
      if (!this.queryModel.hasOwnProperty('userId')) {
        this.queryModel.userId = this.userId;
      }
    }
    if (page) {
      this.queryModel.page = page;
    }
    this.loadingGrid = true;
    this.queryModel.userId = this.userId;
    this.enduserData = await this.enduserService.getEndusers(this.queryModel);
    _.forEach(this.enduserData.data, item => {

      this.statuses[item._id] = item.status === Status.ACTIVE;


    });
    this.loadingGrid = false;
  }
  async loadDataByPage($event: number = 1) {
    await this.loadData(null, $event);
  }

  async loadDataByPageSize($event: number = 20) {
    this.queryModel.limit = $event;
    await this.loadData(null, 1);
  }

  async active(enduser: EndUser = null, status = false) {
    if (status) {
      enduser.status = Status.ACTIVE;
    } else {
      enduser.status = Status.DELETED;
    }
    const response = await this.enduserService.updateEnduser(enduser);
    if (response.errorCode === 0) {
      await this.loadData();
    }
  }

  handleActive(enduser: EndUser = null) {
    this.loadingStatus = true;
    this.active(enduser, !this.statuses[enduser._id]);
    this.loadingStatus = false;
  }

  handleUpdate(id: string = null) {
    this.modify.emit(id);
  }
  handleSubEndUser(endUserId: string = null) {
    this.createSubEndUser.emit(endUserId);
  }
}
