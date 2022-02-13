import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Condition } from '@/modules/marketing/models/condition';
import { CONDITION } from '@/constants/Condition';
import { LoyaltyPointConditionModel } from '@/modules/marketing/models/loyalty-policy-condition.model';
import { LoyaltyPointPolicyModel } from '@/modules/marketing/models/loyalty-point-policy.model';
import { LoyaltyPointPolicyService } from '@/modules/marketing/services/loyalty-point-policy.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModelAppendable } from '@/utility/components/paging/paging.model';
import { Status } from 'app/constants/status.enum';

@Component({
  selector: 'loyalty-point-policy-modification-modal',
  templateUrl: './loyalty-point-policy-modification-modal.component.html',
  styleUrls: ['./loyalty-point-policy-modification-modal.component.less']
})
export class LoyaltyPointPolicyModificationModalComponent {
  @Input() visible: boolean = false;
  @Output() onFinished = new EventEmitter<boolean>();
  @Output() handleVisible = new EventEmitter<boolean>();
  @ViewChild('createPolicyForm') createPolicyForm: NgForm;
  status = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];
  data = new LoyaltyPointPolicyModel();
  effectedDate: any;
  expiredDate: any;
  tableData = new PagingModelAppendable<LoyaltyPointConditionModel>();
  policyConditions = {};
  visibleConditionModal: boolean = false;
  conditionOptionsForConditionModal = CONDITION.loyaltyPolicyPoint;
  currentCondition: Condition = new Condition();
  currentIndex: number = 0;
  currentKey: string = null;
  pageSize = 20;
  pageIndex = 1;

  @Input()
  set model(value: LoyaltyPointPolicyModel) {
    if (value) {
      this.data = value;
      if (value._id) {
        this.effectedDate = new Date(value.effectedAt);
        this.expiredDate = new Date(value.expiredAt);
        if (value.details && value.details.length) {
          this.tableData = new PagingModelAppendable<LoyaltyPointConditionModel>();
          value.details.forEach(conditionItem => {
            const uniKey = _.uniqueId('condition');
            conditionItem = { ...conditionItem, key: uniKey };
            this.policyConditions = { ...this.policyConditions, [uniKey]: conditionItem };
            this.tableData.add(conditionItem);
          });
        }
      }
    }
  }

  get model() {
    return this.data;
  }

  constructor(
    private promotionPolicyService: LoyaltyPointPolicyService,
    private messageService: NzMessageService
  ) { }

  editCondition(index, condition: LoyaltyPointConditionModel) {
    this.currentCondition = _.cloneDeep(condition);
    this.currentKey = condition.key;
    this.currentIndex = index;
    this.handleVisibleAddConditionsModal(true);
  }

  removeCondition(index, key) {
    this.tableData.remove(index);
    if (this.policyConditions[key]) {
      delete this.policyConditions[key];
    }
    this.resetDataCondition();
  }

  handleVisibleAddConditionsModal(flag?) {
    this.visibleConditionModal = !!flag;
  }

  createCondition() {
    this.handleVisibleAddConditionsModal(true);
  }


  async onConfirmModal() {
    if (this.tableData.total) {
      this.model.details = this.tableData.data.map(value => _.omit(value, 'key'));
    }
    if (!this.model._id) {
      if (this.createPolicyForm.valid) {
        if (this.model.expiredAt < this.model.effectedAt) {
          this.messageService.warning('Ngày kết thúc không hợp lệ');
          return;
        }

        const response = await this.promotionPolicyService.create(this.model);
        if (response.errorCode !== 0) {
          this.messageService.error(CommonHelper.errorMessage(response, 'Cập nhật thành công'));
        } else {
          this.onFinished.emit();
          this.messageService.success('Tạo thành công');
        }
        this.reset();
        this.handleVisibleModal(false);
      } else {
        this.messageService.warning('Vui lòng kiểm tra lại dữ liệu');
        CommonHelper.validateForm(this.createPolicyForm);
      }
    } else {
      if (this.createPolicyForm.valid) {
        if (this.model.expiredAt < this.model.effectedAt) {
          this.messageService.warning('Ngày kết thúc không hợp lệ');
          return;
        }
        await this.promotionPolicyService.update(this.model);
        CommonHelper.resetForm(this.createPolicyForm);
        this.handleVisibleModal(false);
        this.messageService.success('Cập nhật thành công');
        this.onFinished.emit();
      } else {
        this.messageService.warning('Vui lòng kiểm tra lại dữ liệu');
        CommonHelper.validateForm(this.createPolicyForm);
      }
    }
  }

  onCancelModal() {
    this.reset();
    this.handleVisibleModal(false);
  }

  handleVisibleModal(flag = false) {
    this.handleVisible.emit(!!flag);
  }

  onChangeAffectingDate($event) {
    if ($event) {
      this.model.effectedAt = Number(moment($event).startOf('day').format('x'));
    }
  }

  onChangeExpirationDate($event) {
    if ($event) {
      this.model.expiredAt = Number(moment($event).endOf('day').format('x'));
    }
  }

  addCondition(condition) {
    const uniKey = _.uniqueId('condition');
    const newCondition = { ...condition, key: this.currentKey || uniKey };
    this.policyConditions = { ...this.policyConditions, [this.currentKey || uniKey]: { ...condition, key: this.currentKey || uniKey } };
    if (!this.currentKey) {
      this.tableData.add(newCondition);
    } else {
      this.tableData.edit(this.currentIndex, newCondition);
    }
    this.resetDataCondition();
  }

  resetDataCondition() {
    this.currentCondition = null;
    this.currentIndex = 0;
    this.currentKey = null;
  }

  reset() {
    if (!this.model._id) {
      this.model = new LoyaltyPointPolicyModel();
      this.effectedDate = null;
      this.expiredDate = null;
    } else {
      this.model = new LoyaltyPointPolicyModel(this.data);
      this.effectedDate = this.data.effectedAt ? new Date(this.data.effectedAt) : null;
      this.expiredDate = this.data.expiredAt ? new Date(this.data.expiredAt) : null;
    }
    this.resetDataCondition();
    CommonHelper.resetForm(this.createPolicyForm);
  }
}
