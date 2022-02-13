import * as _ from 'lodash';
import { AccountType } from '@/constants/AccountType';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GroupServicer } from '@/modules/servicer/models/group-servicer/group-servicer.model';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { RewardModel } from '@/modules/marketing/models/reward.model';
import { RewardService } from '@/modules/marketing/services/reward.service';
import { RewardType } from '@/modules/marketing/constants/reward-type';
import { SendRewardRequest } from '@/modules/marketing/models/send-reward-request';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { ServicerType } from '@/constants/ServicerType';
import { TeamServicer } from '@/modules/servicer/models/team-servicer/team-servicer.model';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelService } from '@/modules/user/services/user-level.service';
import { UserStatus } from '@/constants/UserStatus';
import { UserType } from '@/constants/UserType';

@Component({
  selector: 'send-reward-modal',
  templateUrl: './send-reward-modal.component.html',
  styleUrls: ['./send-reward-modal.component.less']
})
export class SendRewardModalComponent implements OnInit {
  @Input() rewardModel: RewardModel = new RewardModel();
  @Input() visible: boolean = false;
  @Output() handleVisible: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() afterSubmit: EventEmitter<any> = new EventEmitter();
  @ViewChild('sendRewardForm') sendRewardForm: NgForm;
  model: SendRewardRequest = new SendRewardRequest();
  _selectedUser: any = null;
  methodType: string = 'individual';
  groups: GroupServicer[] = [];
  teams: TeamServicer[] = [];
  userType = AccountType;
  selectedTeams: TeamServicer[] = [];
  userLevelOptionList = [];
  isProcessing: boolean = false;
  customerSearchCondition = {
    status: `${UserStatus.ACTIVE}`,
    type: `${UserType.INDIVIDUAL},${UserType.ENTERPRISE},${UserType.OPERATOR}`,
    fields: 'fullName,phone,code',
  };
  servicerSearchCondition = {
    status: `${UserStatus.ACTIVE}`,
    type: `${ServicerType.Personal},${ServicerType.Enterprise},${ServicerType.truckHub}`,
    fields: 'fullName,phone,code',
  };

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
    }
  }

  get selectedUser() {
    return this._selectedUser;
  }

  constructor(
    private messageService: NzMessageService,
    private rewardService: RewardService,
    public servicerService: ServicerService,
    private translateService: TranslateService,
    private userLevelService: UserLevelService,
  ) { }

  ngOnInit() {
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
    if (this.sendRewardForm.valid) {
      this.model.rewardType = this.rewardModel.type;
      this.isProcessing = true;
      const response = await this.rewardService.send(this.rewardModel._id, this.model);
      if (response.errorCode === 0) {
        this.messageService.success(`${this.translateService.instant('button.send')} ${this.translateService.instant('common.successfully')}`);
        this.afterSubmit.emit();
        this.handleVisibleModal(false);
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
      this.isProcessing = false;
    } else {
      CommonHelper.validateForm(this.sendRewardForm);
    }
  }

  reset() {
    this.methodType = 'individual';
    this._selectedUser = null;
    this.model = new SendRewardRequest();
    CommonHelper.resetForm(this.sendRewardForm);
  }

  onChangeMethodType() {
    switch (this.methodType) {
      case AccountType.USER:
        this.model.userLevelId = 'all';
        this.makeModelCustomerCase();
        break;
      case 'individual':
        this.makeModelIndividualCase();
        break;
      case AccountType.SERVICER:
        this.model.groupId = 'all';
        this.makeModelServicerCase();
    }
  }

  makeModelCustomerCase() {
    delete this.model.groupId;
    delete this.model.teamId;
    delete this.model.userIds;
    this._selectedUser = null;
  }

  makeModelIndividualCase() {
    delete this.model.groupId;
    delete this.model.teamId;
    delete this.model.userLevelId;
  }

  makeModelServicerCase() {
    delete this.model.userLevelId;
    delete this.model.userIds;
    this._selectedUser = null;
    if (this.model.groupId === 'all') {
      delete this.model.teamId;
    }
  }

  allowCustomer() {
    return true;
  }

  allowServicer() {
    return (this.rewardModel.type !== RewardType.PROMOTION_CODE);
  }
}
