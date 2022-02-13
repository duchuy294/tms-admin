import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
  } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ResponseModel } from '../../../models/response';
import { ResponseService } from '@/modules/marketing/services/response.service';

@Component({
  selector: 'response-grid',
  templateUrl: './response-grid.component.html',
  styleUrls: ['./response-grid.component.less']
})
export class ResponseGridComponent implements OnInit {
  adminUpdatedBy: { [_id: string]: AccountModel } = {};
  loadingGrid: boolean = false;
  queryModel: QueryModel = new QueryModel({ status: null });
  public tableData = new PagingModel<ResponseModel>();

  @Output() clickShowReply = new EventEmitter();
  @Output() clickToShowReplyModal = new EventEmitter();
  @Output() modelChange = new EventEmitter();

  @Input() selectedResponse: any;
  @Output() selectedResponseChange = new EventEmitter();


  constructor(
    private adminService: AdminService,
    private responseService: ResponseService,
  ) { }

  async ngOnInit() {
    await this.loadData();
  }

  async getAdmins(data: PagingModel<ResponseModel>, field: string = '') {
    const accountIds = _.map(data.data, response => response[field]).join(',');
    const adminPaging = await this.adminService.getAdmins(new QueryModel({ accountIds }));
    return adminPaging.data;
  }

  async triggerLoadData(queryModel: QueryModel, pageIndex?) {
    if (queryModel) {
      this.queryModel = queryModel;
    }
    await this.loadData(pageIndex);
  }

  async loadData(pageIndex?) {
    if (pageIndex) {
      this.queryModel.page = pageIndex;
    }
    this.loadingGrid = true;
    this.tableData = await this.responseService.filter(this.queryModel);
    const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
    _.forEach(updatedBy, admin => {
      this.adminUpdatedBy[admin._id] = admin;
    });
    this.loadingGrid = false;
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

  handleClickResponse(response) {
    this.selectedResponse = response;
    this.selectedResponseChange.emit(this.selectedResponse);
    this.clickShowReply.emit();
  }

  handleClickShowReplyModal(response) {
    this.selectedResponse = response;
    this.selectedResponseChange.emit(this.selectedResponse);
    this.clickToShowReplyModal.emit();
  }
}
