import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '../../../admin/services/admin.service';
import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { MarketingNewsService } from '@/modules/news/services/marketing-news.service';
import { NewsCategoryService } from '@/modules/news/services/news-category.service';
import { NewsModel } from '@/modules/news/models/news.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from '../../../../models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'news-grid',
  templateUrl: './news-grid.component.html',
})
export class NewsGridComponent implements OnInit {
  adminUpdatedBy: { [_id: string]: AccountModel } = {};
  catId: { [_id: string]: string } = {};
  loadingGrid: boolean = false;
  loadingStatus: boolean = false;
  public tableData = new PagingModel<NewsModel>();
  queryModel: QueryModel = new QueryModel();
  statuses: { [_id: string]: boolean } = {};

  @Output() edit = new EventEmitter();
  @Output() send = new EventEmitter();

  constructor(
    private adminService: AdminService,
    private marketingNewsService: MarketingNewsService,
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private newsCategoryService: NewsCategoryService,
    private translateService: TranslateService,
  ) { }

  async ngOnInit() {
    const catIds = await this.getCategories(this.tableData, 'catId');
    _.forEach(catIds, cat => {
      this.catId[cat._id] = cat.name;
    });

    await this.loadData();
  }

  async getAdmins(data: PagingModel<NewsModel>, field: string = '') {
    const accountIds = _.map(data.data, response => response[field]).join(',');
    const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds }));
    return adminPaging.data;
  }

  async getCategories(data: PagingModel<NewsModel>, field: string = '') {
    const catIds = _.map(data.data, response => response[field]).join(',');
    const categoryPaging = await this.newsCategoryService.filter(new QueryModel({ limit: 1000, catIds }));
    return categoryPaging.data;
  }

  async triggerLoadData(queryModel: QueryModel, pageIndex?) {
    await this.loadData(queryModel, pageIndex);
  }

  async loadData(query = null, page = null) {
    if (query) {
      this.queryModel = new QueryModel(query);
    }
    if (page) {
      this.queryModel.page = page;
    }
    this.loadingGrid = true;
    this.tableData = await this.marketingNewsService.getList(this.queryModel);

    const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
    _.forEach(updatedBy, admin => {
      this.adminUpdatedBy[admin._id] = admin;
    });

    _.forEach(this.tableData.data, news => {
      this.statuses[news._id] = news.status;
    });
    this.loadingGrid = false;
  }

  async loadDataByPage($event) {
    await this.loadData(null, $event);
  }

  async loadDataByPageSize($event) {
    this.queryModel.limit = $event;
    await this.loadData(null, 1);
  }

  handleEdit(newsId) {
    this.edit.emit(newsId);
  }

  handleSend(newsId) {
    this.send.emit(newsId);
  }

  activateConfirm(news, status = false) {
    let response = true;
    this.modalService.confirm({
      nzTitle: this.translateService.instant(status ? 'common.confirmActivate' : 'common.confirmDeactivate'),
      nzOnOk: () => this.activate(news, status),
      nzOnCancel: () => { response = false; },
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('button.confirm')
    });
    return response;
  }

  async activate(news, status) {
    const response = await this.marketingNewsService.update({ ...news, status });
    if (response) {
      this.messageService.success(this.translateService.instant(`marketing.news.status-${(status) ? 'activate-complete' : 'deactivate-complete'}`));
      await this.loadData(null, this.queryModel.page);
    } else {
      this.messageService.error(this.translateService.instant(`marketing.news.status-${(status) ? 'activate-fail' : 'deactivate-fail'}`));
    }
  }

  onChangeStatus(news) {
    this.loadingStatus = true;
    this.activateConfirm(news, !this.statuses[news._id]);
    this.loadingStatus = false;
  }

  catIdsToString(catIds) {
    return catIds.map(id => this.catId[id]).join(',    ');
  }
}
