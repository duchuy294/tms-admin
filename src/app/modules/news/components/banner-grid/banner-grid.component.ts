import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { NewsBannerModel } from '@/modules/news/models/news-banner.model';
import { NewsBannerService } from '../../services/news-banner.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '../../../../models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'banner-grid',
  templateUrl: './banner-grid.component.html',
})
export class BannerGridComponent implements OnInit {
  adminUpdatedBy: { [_id: string]: AccountModel } = {};
  loadingGrid: boolean = false;
  loadingStatus: boolean = false;
  public tableData = new PagingModel<NewsBannerModel>();
  queryModel: QueryModel = new QueryModel();
  statuses: { [_id: string]: boolean } = {};

  @Output() edit = new EventEmitter();

  constructor(
    private adminService: AdminService,
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private newsBannerService: NewsBannerService,
    private translateService: TranslateService
  ) { }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData(page = 1) {
    this.queryModel.page = page;
    this.loadingGrid = true;
    this.tableData = await this.newsBannerService.getList(this.queryModel);
    const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
    _.forEach(updatedBy, admin => {
      this.adminUpdatedBy[admin._id] = admin;
    });

    _.forEach(this.tableData.data, banner => {
      this.statuses[banner._id] = banner.active;
    });
    this.loadingGrid = false;
  }

  async loadDataByPage($event) {
    await this.loadData($event);
  }

  async loadDataByPageSize($event) {
    this.queryModel.limit = $event;
    await this.loadData(1);
  }

  handleEdit(bannerId) {
    this.edit.emit(bannerId);
  }

  async getAdmins(data: PagingModel<NewsBannerModel>, field: string = '') {
    const accountIds = _.map(data.data, response => response[field]).join(',');
    const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds }));
    return adminPaging.data;
  }

  activateConfirm(banner, active = false) {
    let response = true;
    this.modalService.confirm({
      nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
      nzOnOk: () => this.activate(banner, active),
      nzOnCancel: () => { response = false; },
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('button.confirm')
    });
    return response;
  }

  async activate(banner, active) {
    const response = await this.newsBannerService.update({ ...banner, active });
    if (response) {
      this.messageService.success(this.translateService.instant(`marketing.news-banner.${(active) ? 'activate-complete' : 'deactivate-complete'}`));
      await this.loadData();
    } else {
      this.messageService.error(this.translateService.instant(`marketing.news-banner.${(active) ? 'activate-fail' : 'deactivate-fail'}`));
    }
  }

  onChangeStatus(banner) {
    this.loadingStatus = true;
    this.activateConfirm(banner, !this.statuses[banner._id]);
    this.loadingStatus = false;
  }
}
