import * as _ from 'lodash';
import { ArticleContentTabComponent } from './article-content-tab/article-content-tab.component';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReferralContentTabComponent } from './referral-content-tab/referral-content-tab.component';
import { ReferralPolicyModel } from '@/modules/referral/models/referral-policy.model';
import { ReferralPolicyService } from '@/modules/referral/services/referral-policy.service';
import { TransactionType } from '@/modules/finance/const/transaction.const';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'create-modify-referral-policy-modal',
  templateUrl: './create-modify-referral-policy-modal.component.html',
  styleUrls: ['./create-modify-referral-policy-modal.component.less']
})
export class CreateModifyReferralPolicyModalComponent implements OnChanges {
  @Input() referralPolicyModel: ReferralPolicyModel = null;
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() afterSubmit = new EventEmitter();
  @ViewChild('createModifyForm') createModifyForm: NgForm;
  @ViewChild('userArticleContent') userArticleContent: ArticleContentTabComponent;
  @ViewChild('servicerArticleContent') servicerArticleContent: ArticleContentTabComponent;
  @ViewChild('userReferrer') userReferrer: ReferralContentTabComponent;
  @ViewChild('servicerReferrer') servicerReferrer: ReferralContentTabComponent;
  selectedUserServicerTabIndex = 0;
  selectedContentTabIndex = 0;
  model: ReferralPolicyModel = new ReferralPolicyModel();
  userReferralCheckbox: {
    giveReward: boolean,
    giveBonusToWallet: boolean
  };
  servicerReferralCheckbox: {
    giveReward: boolean,
    giveBonusToWallet: boolean
  };
  userReferrerCheckbox: {
    giveReward: boolean,
    giveBonusToWallet: boolean
  };
  servicerReferrerCheckbox: {
    giveReward: boolean,
    giveBonusToWallet: boolean
  };
  optionalFields = ['userPresentee', 'userPresenter', 'servicerPresentee', 'servicerPresenter'];

  isProcessing: boolean = false;

  constructor(
    private messageService: NzMessageService,
    private referralPolicyService: ReferralPolicyService,
    private translateService: TranslateService,
  ) { }

  ngOnChanges(): void {
    if (this.visible) {
      this.init();
    }
  }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }

  initWallet(item) {
    if (!item.walletType) {
      item.walletType = TransactionType.MAIN;
    }
  }

  init() {
    if (this.referralPolicyModel) {
      this.model = _.cloneDeep(this.referralPolicyModel);
    } else {
      this.model = new ReferralPolicyModel();
    }
    this.optionalFields.forEach(field => {
      this.initWallet(this.model[field]);
    });
    this.selectedUserServicerTabIndex = 0;
    this.selectedContentTabIndex = 0;
  }

  validateRewardBonus(item, checkbox) {
    if (!checkbox.giveReward) {
      item.rewards = [];
    }

    if (!checkbox.giveBonusToWallet) {
      if (_.isArray(item.bonus)) {
        item['bonus'] = [];
      } else {
        item['bonus'] = 0;
      }
      delete item.walletType;
    }
  }

  validateEmpty(field) {
    if (_.isEmpty(this.model[field])) {
      delete this.model[field];
    }
  }

  validateModel() {
    this.validateRewardBonus(this.model.userPresentee, this.userReferralCheckbox);
    this.validateRewardBonus(this.model.userPresenter, this.userReferrerCheckbox);
    this.validateRewardBonus(this.model.servicerPresentee, this.servicerReferralCheckbox);
    this.validateRewardBonus(this.model.servicerPresenter, this.servicerReferrerCheckbox);
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    this.referralPolicyService.trimData(this.model);
    if (!this.userArticleContent.valid() || !this.servicerArticleContent.valid()) {
      this.userArticleContent.validateForm();
      this.servicerArticleContent.validateForm();
      this.messageService.warning(this.translateService.instant('marketing.referral-policy-validations.invalid-data-article'));
      return;
    }
    if (!this.userReferrer.valid() || !this.servicerReferrer.valid()) {
      this.messageService.warning(this.translateService.instant('marketing.referral-policy-validations.invalid-data-referrer'));
      return;
    } else {
      this.userReferrer.resetValidation();
      this.servicerReferrer.resetValidation();
    }
    if (this.createModifyForm.valid) {
      this.validateModel();
      this.isProcessing = true;
      let response;
      if (this.referralPolicyModel) {
        response = await this.referralPolicyService.updateReferralPolicy(this.model);
      } else {
        response = await this.referralPolicyService.createReferralPolicy(this.model);
      }
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.afterSubmit.emit();
        this.handleVisibleModal(false);
        this.messageService.success(`${this.translateService.instant(`actions.${this.referralPolicyModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
    } else {
      CommonHelper.validateForm(this.createModifyForm);
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  reset() {
    this.init();
    CommonHelper.resetForm(this.createModifyForm);
    this.servicerArticleContent.resetForm();
    this.userArticleContent.resetForm();
  }

  handleUserReferralCheckbox(event: any) {
    this.userReferralCheckbox = event;
  }

  handleServicerReferralCheckbox(event: any) {
    this.servicerReferralCheckbox = event;
  }

  handleUserReferrerCheckbox($event) {
    this.userReferrerCheckbox = $event;
  }

  handleServicerReferrerCheckbox($event) {
    this.servicerReferrerCheckbox = $event;
  }
}
