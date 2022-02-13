import * as _ from 'lodash';
import { AccountType } from 'app/constants/AccountType';
import { AdminService } from '@/modules/admin/services/admin.service';
import { BalanceService } from '@/modules/finance/services/balance.service';
import { Component, Input, OnInit } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { TransactionDetailModalComponent } from '../../transaction-detail-modal/transaction-detail-modal.component';
import { TransactionModel } from '@/modules/finance/models/transaction.model';
import { TransactionService } from './../../../services/transaction.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'transaction-grid',
  templateUrl: './transaction-grid.component.html',
  styleUrls: ['./transaction-grid.component.less']
})
export class TransactionGridComponent implements OnInit {
  public tableData = new PagingModel<TransactionModel>();
  accountGroups = {};
  orderId: { [id: string]: string } = {};
  servicerGroups = {};
  userGroups = {};
  @Input() queryModel: QueryModel = new QueryModel({ status: null });
  loadingGrid: boolean = false;

  constructor(
    private adminService: AdminService,
    private balanceService: BalanceService,
    private customerService: CustomerService,
    private modalService: NzModalService,
    private servicerService: ServicerService,
    private transactionService: TransactionService,
    private translateService: TranslateService
  ) { }

  async _loadMetaData() {
    const accountIds = [];
    const servicerIds = [];
    const userIds = [];
    _.forEach(this.tableData.data, (item) => {
      if (item.verifierId) {
        accountIds.push(item.verifierId);
      }
      if (item.verifierId) {
        accountIds.push(item.verifierId);
      }

      if (item.userType === AccountType.SERVICER) {
        servicerIds.push(item.userId);
      }

      if (item.userType === AccountType.USER) {
        userIds.push(item.userId);
      }
    });

    if (_.uniq(userIds).length > 0) {
      this.userGroups = _.groupBy((await this.customerService.getCustomers(new QueryModel({ limit: 1000, userIds: _.uniq(userIds).join(',') }))).data, x => x._id);
    }

    if (_.uniq(servicerIds).length > 0) {
      this.servicerGroups = _.groupBy((await this.servicerService.getServicers(new QueryModel({ limit: 1000, servicerIds: _.uniq(servicerIds).join(',') }))).data, x => x._id);
    }

    if (_.uniq(accountIds).length > 0) {
      this.accountGroups = _.groupBy((await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds: _.uniq(accountIds).join(',') }))).data, x => x._id);
    }
  }

  async ngOnInit() {
    await this.loadData();
  }

  async triggerLoadData(queryModel: QueryModel, pageIndex?) {
    await this.loadData(queryModel, pageIndex);
  }

  async loadData(query: QueryModel = null, page = 1) {
    if (query) {
      this.queryModel = new QueryModel(query);
    }
    if (page) {
      this.queryModel.page = page;
    }
    this.loadingGrid = true;

    this.tableData = await this.transactionService.filter(this.queryModel);
    const verifyQuery = this.balanceService.verifyPageQueryModel(this.tableData, this.queryModel);
    if (verifyQuery.error) {
      this.queryModel = verifyQuery.modelQuery;
      this.tableData = await this.transactionService.filter(this.queryModel);
    }
    this._loadMetaData();

    this.loadingGrid = false;
  }

  async loadDataByPage($event = 1) {
    await this.loadData(null, $event);
  }

  async loadDataByPageSize($event = 20) {
    this.queryModel.limit = $event;
    await this.loadData(null, 1);
  }

  async showDetail(model: TransactionModel) {
    this.modalService.create({
      nzWidth: 650,
      nzTitle: this.translateService.instant('common.detail'),
      nzContent: TransactionDetailModalComponent,
      nzComponentParams: {
        model,
        user: this.userGroups[model.userId] ? this.userGroups[model.userId][0] : (this.servicerGroups[model.userId] ? this.servicerGroups[model.userId][0] : null),
        verifier: this.accountGroups[model.verifierId] ? this.accountGroups[model.verifierId][0] : null,
        performer: this.accountGroups[model.performerId] ? this.accountGroups[model.performerId][0] : null,
        change: this.loadData.bind(this)
      },
      nzFooter: null
    });
  }
}
