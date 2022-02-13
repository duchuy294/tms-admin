import * as _ from 'lodash';
import { AccountType } from '@/constants/AccountType';
import { BalanceAccountType } from '@/modules/finance/const/transaction.const';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { GroupServicer } from '@/modules/servicer/models/group-servicer/group-servicer.model';
import { MarketingNewsService } from '@/modules/news/services/marketing-news.service';
import { NewsModel } from '@/modules/news/models/news.model';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { SendNewsNotificationRequest } from '@/modules/news/models/send-news-notification-request';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { TeamServicer } from '@/modules/servicer/models/team-servicer/team-servicer.model';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelService } from '@/modules/user/services/user-level.service';
import { UserStatus } from '@/constants/UserStatus';

@Component({
  selector: 'send-news-notification-modal',
  templateUrl: './send-news-notification-modal.component.html',
  styleUrls: ['./send-news-notification-modal.component.less']
})
export class SendNewsNotificationModalComponent implements OnInit {
  model: SendNewsNotificationRequest = new SendNewsNotificationRequest();
  balanceAccountType = BalanceAccountType;
  _selectedUser: any = null;
  isProcessing: boolean = false;
  groups: GroupServicer[] = [];
  teams: TeamServicer[] = [];
  userLevelOptionList = [];
  selectedTeams: TeamServicer[] = [];
  methodType: string = 'individual';
  userType = AccountType;
  customerSearchCondition = {
    status: `${UserStatus.NEW},${UserStatus.ACTIVE}`,
    fields: 'fullName,phone,code',
  };
  servicerSearchCondition = {
    status: `${UserStatus.NEW},${UserStatus.ACTIVE}`,
    fields: 'fullName,phone,code',
  };

  @Input() visible: boolean = false;
  @Input() newsModel: NewsModel = new NewsModel({ status: true });
  @Output() handleVisible = new EventEmitter();
  @ViewChild('sendNewsNotiForm') sendNewsNotiForm: NgForm;

  set selectedUser(value) {
    if (_.isArray(value)) {
      this._selectedUser = value;
      this.model.userIds = [];
      this.model.userTypes = [];
      for (const item of value) {
        this.model.userIds.push(item._id);
        this.model.userTypes.push(item.userType);
      }
    } else if (value === null) {
      this._selectedUser = value;
      this.model.userId = null;
    }
  }

  get selectedUser() {
    return this._selectedUser;
  }

  constructor(
    private newsService: MarketingNewsService,
    private messageService: NzMessageService,
    public servicerService: ServicerService,
    private translateService: TranslateService,
    private userLevelService: UserLevelService,
    public userService: CustomerService,
  ) { }

  async ngOnInit() {
    this.getUserLevel();
    this.getGroups();
  }

  async getUserLevel() {
    const response = await this.userLevelService.getUserLevels(new QueryModel());
    this.userLevelOptionList = response.data;
  }

  async getGroups() {
    const result = await this.servicerService.getGroupServicers(
      new QueryModel({ limit: 1000 })
    );
    this.groups = result.data;
  }

  async changeGroup() {
    if (this.model.groupId) {
      this.model.teamId = 'all';
      this.teams = (await this.servicerService.getTeamServicers(
        new QueryModel({ groupId: this.model.groupId })
      )).data;
    } else {
      this.teams = [];
    }
    this.selectedTeams = [];
  }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    if ((!this.model.userIds || _.isEmpty(this.model.userIds)) && !this.model.userLevelId && !this.model.groupId && !this.model.teamId) {
      this.messageService.warning(this.translateService.instant('finance.transaction-bonus-forfeit.no-target-validations'));
      return;
    }
    if (this.sendNewsNotiForm.valid) {
      this.isProcessing = true;
      const response = await this.newsService.sendNotification(this.newsModel._id, this.model);
      if (response.errorCode === 0) {
        this.messageService.success(`${this.translateService.instant('button.send')} ${this.translateService.instant('common.successfully')}`);
        this.handleVisibleModal(false);
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
      this.isProcessing = false;
    } else {
      CommonHelper.validateForm(this.sendNewsNotiForm);
    }
  }

  reset() {
    this.methodType = 'individual';
    this._selectedUser = null;
    this.model = new SendNewsNotificationRequest();
    CommonHelper.resetForm(this.sendNewsNotiForm);
  }

  onChangeMethodType() {
    switch (this.methodType) {
      case BalanceAccountType.CUSTOMER:
        this.model.userLevelId = 'all';
        this.makeModelCustomerCase();
        break;
      case 'individual':
        this.makeModelIndividualCase();
        break;
      case BalanceAccountType.PARTNER:
        this.model.groupId = 'all';
        this.makeModelServicerCase();
    }
  }

  makeModelCustomerCase() {
    delete this.model.groupId;
    delete this.model.teamId;
    delete this.model.userId;
    this.model.userType = 'user';
  }

  makeModelIndividualCase() {
    delete this.model.groupId;
    delete this.model.teamId;
    delete this.model.userLevelId;
  }

  makeModelServicerCase() {
    delete this.model.userLevelId;
    delete this.model.userId;
    this.model.userType = 'servicer';
    if (this.model.groupId === 'all') {
      delete this.model.teamId;
    }
  }

  allowIndividual() {
    if (this.newsModel && this.newsModel.targets) {
      return this.newsModel.targets.includes(this.userType.USER) || this.newsModel.targets.includes(this.userType.SERVICER);
    }
    return false;
  }

  allowCustomer() {
    if (this.newsModel && this.newsModel.targets) {
      return this.newsModel.targets.includes(this.userType.USER);
    }
    return false;
  }

  allowServicer() {
    if (this.newsModel && this.newsModel.targets) {
      return this.newsModel.targets.includes(this.userType.SERVICER);
    }
    return false;
  }
}
