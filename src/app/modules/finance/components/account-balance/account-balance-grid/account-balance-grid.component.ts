import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AccountType } from '@/constants/AccountType';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletEditModel } from '@/modules/finance/models/wallet-edit.model';
import { WalletModel } from '@/modules/finance/models/wallet.model';
import { WalletService } from '@/modules/finance/services/wallet.service';

@Component({
  selector: 'account-balance-grid',
  templateUrl: './account-balance-grid.component.html'
})
export class AccountBalanceGridComponent implements OnInit {
  loadingGrid: boolean = false;
  loadingStatus: boolean = false;
  public tableData = new PagingModel<WalletModel>();
  queryModel: QueryModel = new QueryModel({ status: null });
  admins: { [_id: string]: AccountModel } = {};
  people: { [_id: string]: any } = {};
  statuses: { [_id: string]: boolean } = {};
  AccountType = AccountType;
  @Output() passingWallet = new EventEmitter<WalletModel>();
  @Output() passingWalletUpdate = new EventEmitter<WalletEditModel>();

  constructor(
    private adminService: AdminService,
    private customerService: CustomerService,
    private messageService: NzMessageService,
    private modelService: NzModalService,
    private servicerService: ServicerService,
    private translateService: TranslateService,
    private walletService: WalletService
  ) { }

  async getFullname() {
    const adminIds = this.tableData.data
      .filter(model => model.updatedBy)
      .map(model => model.updatedBy)
      .join(',');
    const servicerIds = this.tableData.data
      .filter(item => item.userType === AccountType.SERVICER)
      .map(item => item.userId)
      .join(',');
    const userIds = this.tableData.data
      .filter(item => item.userType === AccountType.USER)
      .map(item => item.userId)
      .join(',');
    const customers = await this.customerService.getCustomers(
      new QueryModel({ userIds, fields: 'code,fullName,lang' })
    );
    const servicers = await this.servicerService.getServicers(
      new QueryModel({
        servicerIds,
        fields: 'code,fullName,lang'
      })
    );
    const adminPaging = await this.adminService.getAdmins(
      new QueryModel({
        limit: this.tableData.limit,
        accountIds: adminIds
      })
    );
    customers.data.forEach(element => {
      this.people[element._id] = element;
    });
    servicers.data.forEach(element => {
      this.people[element._id] = element;
    });
    adminPaging.data.forEach(element => {
      this.admins[element._id] = element;
    });
  }

  async ngOnInit() {
    await this.loadData();
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

    this.tableData = await this.walletService.filter(this.queryModel);
    const verifyQuery = this.walletService.verifyPageQueryModel(
      this.tableData,
      this.queryModel
    );
    if (verifyQuery.error) {
      this.queryModel = verifyQuery.modelQuery;
      this.tableData = await this.walletService.filter(this.queryModel);
    }
    _.forEach(this.tableData.data, element => {
      this.statuses[element._id] = element.postPay;
    });
    this.getFullname();

    this.loadingGrid = false;
  }

  async loadDataByPage($event = 1) {
    await this.loadData(null, $event);
  }

  async loadDataByPageSize($event = 20) {
    this.queryModel.limit = $event;
    await this.loadData(null, 1);
  }

  activate(id: string = null, flag = false) {
    let response = true;
    this.modelService.confirm({
      nzTitle: this.translateService.instant(
        flag ? 'common.confirmActivate' : 'common.confirmDeactivate'
      ),
      nzOnOk: () => this.activateConfirm(id, flag),
      nzOnCancel: () => {
        response = false;
      },
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('button.confirm')
    });
    return response;
  }

  async activateConfirm(id: string = null, flag = false) {
    const response = await this.walletService.activatePostpaid(id, {
      postpaid: flag
    });
    if (response) {
      this.messageService.success(
        this.translateService.instant(
          `finance-wallet.postpaid-allowed.${
          flag ? 'activate-success' : 'deactivate-success'
          }`
        )
      );
      await this.loadData();
    } else {
      this.messageService.error(
        this.translateService.instant(
          `finance-wallet.postpaid-allowed.${
          flag ? 'activate-failed' : 'deactivate-failed'
          }`
        )
      );
    }
  }

  onChangeStatus(item = new WalletModel()) {
    this.loadingStatus = true;
    this.activate(item._id, !this.statuses[item._id]);
    this.loadingStatus = false;
  }

  passingWalletData(wallet: WalletModel) {
    this.passingWallet.emit(wallet);
  }

  passingWalletUpdateData(wallet: WalletModel) {
    this.passingWalletUpdate.emit(
      <WalletEditModel>(
        _.pick(wallet, [
          '_id',
          'minWithdraw',
          'maxWithdraw',
          'minRemaining'
        ])
      )
    );
  }
}
