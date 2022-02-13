import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ReferralPolicyModel } from '@/modules/referral/models/referral-policy.model';
import { ReferralPolicyQueryModel } from '@/modules/referral/models/referral-policy-query.model';
import { ReferralPolicyService } from '@/modules/referral/services/referral-policy.service';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'referral-policy-grid',
  templateUrl: './referral-policy-grid.component.html'
})

export class ReferralPolicyGridComponent implements OnInit {
  @Input()
  set model(value: ReferralPolicyQueryModel) {
    this.modelQuery = value;
  }

  get model() {
    return this.modelQuery;
  }

  modelQuery = new ReferralPolicyQueryModel();
  loading: boolean = false;
  loadingStatus: boolean = false;
  accounts: { [_id: string]: AccountModel } = {};
  statuses: { [_id: string]: boolean } = {};

  constructor(
    private referralPolicyService: ReferralPolicyService,
    private adminService: AdminService,
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private modelService: NzModalService,
  ) { }

  async ngOnInit() {
    this.modelQuery.status = `${Status.NEW}, ${Status.ACTIVE}`;
    await this.loadData();
  }

  public tableData = new PagingModel<ReferralPolicyModel>();

  async loadData(modelQuery: ReferralPolicyQueryModel = null) {
    this.loading = true;

    if (modelQuery) {
      this.modelQuery = modelQuery;
    }
    this.tableData = await this.referralPolicyService.getReferralPolicies(this.modelQuery);

    const verifyQuery = this.referralPolicyService.verifyPageQueryModel(this.tableData, this.modelQuery);
    if (verifyQuery.error) {
      this.modelQuery = verifyQuery.modelQuery;
      this.tableData = await this.referralPolicyService.getReferralPolicies(this.modelQuery);
    }

    const accounts = await this.getAccounts(this.tableData);
    _.forEach(accounts, (account) => {
      this.accounts[account._id] = account;
    });

    _.forEach(this.tableData.data, referralPolicy => {
      this.statuses[referralPolicy._id] = (referralPolicy.status === Status.ACTIVE);
    });

    this.loading = false;
  }

  async loadDataByPage(event = 1) {
    this.modelQuery.page = event;
    await this.loadData();
  }

  async loadDataByPageSize(event = 20) {
    this.modelQuery.limit = event;
    await this.loadData();
  }

  async getAccounts(data: PagingModel<ReferralPolicyModel>) {
    const accountIds = _.map(data.data, link => link.updatedBy).join(',');
    const userPaging = await this.adminService.getAdmins(new QueryModel({ limit: this.model.limit, accountIds }));
    return userPaging.data;
  }

  activate(referralPolicyId = null, active = false) {
    let response = true;
    this.modelService.confirm({
      nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
      nzOnOk: () => this.activateConfirm(referralPolicyId, active),
      nzOnCancel: () => { response = false; },
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('button.confirm')
    });
    return response;
  }

  async activateConfirm(referralPolicyId = null, active = false) {
    const response = await this.referralPolicyService.activate({ _id: referralPolicyId, status: active });
    if (response) {
      this.messageService.success(this.translateService.instant(`referralPolicy.status.${(active ? 'activate-complete' : 'deactivate-complete')}`));
      await this.loadData();
    } else {
      this.messageService.error(this.translateService.instant(`referralPolicy.status.${(active) ? 'activate-fail' : 'deactivate-fail'}`));
    }
  }

  onChangeStatus(referralPolicyItem = new ReferralPolicyModel()) {
    this.loadingStatus = true;
    this.activate(referralPolicyItem._id, !this.statuses[referralPolicyItem._id]);
    this.loadingStatus = false;
  }
}
