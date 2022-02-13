import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { RewardService } from '@/modules/marketing/services/reward.service';
import { TransactionType } from '@/modules/finance/const/transaction.const';

@Component({
  selector: 'referral-content-tab',
  templateUrl: './referral-content-tab.component.html',
  styleUrls: ['./referral-content-tab.component.less']
})
export class ReferralContentTabComponent implements OnInit {
  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @Output() checkbox = new EventEmitter<{
    giveReward: boolean,
    giveBonusToWallet: boolean
  }>();
  numberMask = createNumberMask({ prefix: '' });
  giveReward: boolean;
  giveBonusToWallet: boolean;
  walletTypes = [TransactionType.MAIN, TransactionType.SUB];
  _selectedReward: any;
  rewardList: { [key: string]: string } = {};
  rewardListArray = [];
  numberOfCol: number = 2;
  @ViewChild('referralForm') referralForm: NgForm;

  get selectedReward() {
    return this._selectedReward;
  }

  set selectedReward(value) {
    if (value && value._id) {
      this._selectedReward = value;
    } else if (value === null) {
      this._selectedReward = value;
    }
  }

  get rewards() {
    return this.model && this.model.rewards ? this.model.rewards : [];
  }

  set rewards(value) {
    this.model.rewards = value;
    this.modelChange.emit(this.model);
  }

  get bonus() {
    return this.model && this.model.bonus ? this.model.bonus : '0';
  }

  set bonus(value) {
    this.model.bonus = CommonHelper.parseS2N(value);
    this.modelChange.emit(this.model);
  }

  get conditions() {
    return this.model && this.model.conditions ? this.model.conditions : {};
  }

  set conditions(value) {
    this.model.conditions = value;
    this.modelChange.emit(this.model);
  }

  get walletType() {
    return this.model && this.model.walletType ? this.model.walletType : TransactionType.MAIN;
  }

  set walletType(value) {
    this.model.walletType = value;
    this.modelChange.emit(this.model);
  }

  constructor(
    private rewardService: RewardService
  ) { }

  ngOnInit() {
    this.initRewardData();
    this.initCheckbox();
  }

  initCheckbox() {
    this.giveReward = (this.model && !_.isEmpty(this.model.rewards)) ? true : false;
    this.giveBonusToWallet = (this.model && this.model.bonus) ? true : false;
    this.onCheckboxChange();
  }

  async initRewardData() {
    if (this.rewards.length > 0) {
      const response = await this.rewardService.filter(new QueryModel({ rewardIds: this.rewards.join(',') }));
      this.rewardListArray = this.rewards;
      response.data.forEach(reward => {
        this.rewardList[reward._id] = reward.name;
      });
    }
  }

  addReward() {
    if (this.selectedReward && !this.rewardList[this.selectedReward._id]) {
      this.rewardListArray.push(this.selectedReward._id);
      this.rewardList[this.selectedReward._id] = this.selectedReward.name;
      this.selectedReward = null;
      this.rewards = this.rewardListArray;
    }
  }

  removeReward(rewardId) {
    if (this.giveReward) {
      this.rewardListArray = _.filter(this.rewardListArray, id => id !== rewardId);
      delete this.rewardList[rewardId];
      this.rewards = this.rewardListArray;
    }
  }

  onCheckboxChange() {
    this.checkbox.emit({
      giveReward: this.giveReward,
      giveBonusToWallet: this.giveBonusToWallet
    });
  }

  onConditionChange(event) {
    this.conditions = event;
  }

  valid(): boolean {
    return this.referralForm.valid;
  }

  resetValidation() {
    CommonHelper.resetForm(this.referralForm);
  }
}
