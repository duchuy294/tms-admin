import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CommonHelper } from '@/utility/common/common.helper';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { QueryModel } from '@/models/query.model';
import { RewardService } from '@/modules/marketing/services/reward.service';
import { TransactionType } from '@/modules/finance/const/transaction.const';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'referrer-content-tab',
  templateUrl: './referrer-content-tab.component.html',
  styleUrls: ['./referrer-content-tab.component.less']
})
export class ReferrerContentTabComponent implements OnInit {
  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @Output() checkbox = new EventEmitter<{
    giveReward: boolean,
    giveBonusToWallet: boolean
  }>();
  private maxBonusItem = 5;
  visibleBonusWarning: boolean = false;
  textBonusWarning: string;
  numberMask = createNumberMask({ prefix: '' });
  giveReward: boolean = false;
  giveBonusToWallet: boolean = false;
  walletTypes = [TransactionType.MAIN, TransactionType.SUB];
  bonusDataFrom: number[] = [];
  bonusDataTo: number[] = [];
  bonusDataAmount: number[] = [];
  value: any;
  _selectedReward: any;
  rewardList: { [key: string]: string } = {};
  rewardListArray = [];

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

  get walletType() {
    return this.model && this.model.walletType ? this.model.walletType : TransactionType.MAIN;
  }

  set walletType(value) {
    this.model.walletType = value;
    this.modelChange.emit(this.model);
  }

  constructor(
    private rewardService: RewardService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.initRewardData();
    this.initBonusData();
    this.initCheckbox();
  }

  initCheckbox() {
    this.giveReward = (this.model && !_.isEmpty(this.model.rewards)) ? true : false;
    this.giveBonusToWallet = (this.model && !_.isEmpty(this.model.bonus)) ? true : false;
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

  initBonusData() {
    if (this.model && this.model.bonus && this.model.bonus.length > 0) {
      this.bonusDataFrom = [0];
      this.bonusDataTo = [0];
      this.bonusDataAmount = [0];
      this.model.bonus.forEach(item => {
        this.bonusDataFrom.push(item.from);
        this.bonusDataTo.push(item.to);
        this.bonusDataAmount.push(item.value);
      });
    } else {
      this.bonusDataFrom = [0];
      this.bonusDataTo = [0];
      this.bonusDataAmount = [0];
    }
  }

  handleFrom(index) {
    this.model.bonus[index - 1].from = this.bonusDataFrom[index];
    if (index > 1) {
      this.bonusDataTo[index - 1] = this.bonusDataFrom[index] - 1;
      this.model.bonus[index - 2].to = this.bonusDataTo[index - 1];
    }
    this.modelChange.emit(this.model);
  }

  handleTo(index) {
    this.model.bonus[index - 1].to = this.bonusDataTo[index];
    if (index < this.bonusDataAmount.length - 1) {
      this.bonusDataFrom[index + 1] = this.bonusDataTo[index] + 1;
      this.model.bonus[index].from = this.bonusDataFrom[index + 1];
    }
    this.modelChange.emit(this.model);
  }

  handleAmount(index) {
    this.model.bonus[index - 1].value = CommonHelper.parseS2N(this.bonusDataAmount[index]);
    this.modelChange.emit(this.model);
  }

  addBonus() {
    const length = this.bonusDataAmount.length;
    if (length === this.maxBonusItem + 1) {
      this.visibleBonusWarning = true;
      this.textBonusWarning = this.translateService.instant('marketing.referral-policy-validations.max-bonus-item-warning');
      return;
    } else {
      this.visibleBonusWarning = false;
    }
    this.bonusDataFrom.push(this.bonusDataTo[length - 1] + 1);
    this.bonusDataTo.push(this.bonusDataTo[length - 1] + 1);
    this.bonusDataAmount.push(0);
    if (!this.model.bonus) {
      this.model.bonus = [];
    }
    this.model.bonus.push({
      from: this.bonusDataFrom[length],
      to: this.bonusDataTo[length],
      value: this.bonusDataAmount[length],
    });
    this.modelChange.emit(this.model);
  }

  removeBonus(removeIndex) {
    this.resetValidation();

    const isTheLast = removeIndex === this.model.bonus.length;
    this.bonusDataFrom = this.bonusDataFrom.filter((_item, index) => index !== removeIndex);
    this.bonusDataTo = this.bonusDataTo.filter((_item, index) => index !== removeIndex);
    this.bonusDataAmount = this.bonusDataAmount.filter((_item, index) => index !== removeIndex);

    this.model.bonus = this.model.bonus.filter((_item, index) => index !== removeIndex - 1);
    if (this.bonusDataAmount.length > 1 && !isTheLast) {
      this.bonusDataFrom[removeIndex] = this.bonusDataTo[removeIndex - 1] + 1;
      this.model.bonus[removeIndex - 1].from = this.bonusDataFrom[removeIndex];
    }

    this.modelChange.emit(this.model);
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

  valid(): boolean {
    if (this.model && this.model.bonus) {
      for (const item of this.model.bonus) {
        if (item.from < 0 || item.to < 0 || item.value < 0) {
          this.textBonusWarning = this.translateService.instant('marketing.referral-policy-validations.negative-number');
          this.visibleBonusWarning = true;
          return false;
        }
        if (!_.isNumber(item.from) || !_.isNumber(item.to) || !_.isNumber(item.value)) {
          this.textBonusWarning = this.translateService.instant('marketing.referral-policy-validations.not-a-number');
          this.visibleBonusWarning = true;
          return false;
        }
        if (item.from > item.to) {
          this.textBonusWarning = this.translateService.instant('marketing.referral-policy-validations.invalid-interval');
          this.visibleBonusWarning = true;
          return false;
        }
      }
    }
    return true;
  }

  resetValidation() {
    this.visibleBonusWarning = false;
  }
}
