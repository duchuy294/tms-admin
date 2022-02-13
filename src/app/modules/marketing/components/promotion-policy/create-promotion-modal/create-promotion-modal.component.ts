import * as moment from 'moment';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PromotionPolicyModel } from '@/modules/marketing/models/promotion-policy';
import { PromotionPolicyQueryModel } from 'app/modules/marketing/models/promotion-policy-query.model';
import { PromotionPolicyService } from '@/modules/marketing/services/promotion-policy.service';
import { Status } from 'app/constants/status.enum';

@Component({
  selector: 'create-promotion-modal',
  templateUrl: './create-promotion-modal.component.html',
  styleUrls: ['./create-promotion-modal.component.less']
})
export class CreatePromotionModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() type: string;
  @Input() id: string;
  @Output() onFinished = new EventEmitter<boolean>();
  @Output() handleVisible = new EventEmitter<boolean>();
  @ViewChild('createPolicyForm') createPolicyForm: NgForm;
  status = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];
  model = new PromotionPolicyModel();
  query = new PromotionPolicyQueryModel();
  error = new PromotionPolicyModel();
  effectedDate: any;
  expiredDate: any;
  data: PromotionPolicyModel;
  constructor(
    private promotionPolicyService: PromotionPolicyService,
    private messageService: NzMessageService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.data = await this.promotionPolicyService.getPromotionPolicy(this.id, this.query);
    this.model = new PromotionPolicyModel(this.data);
    if (this.model._id) {
      this.effectedDate = new Date(this.data.effectedAt);
      this.expiredDate = new Date(this.data.expiredAt);
    }
  }

  async onConfirmModal() {
    if (this.type === 'create') {
      if (this.createPolicyForm.valid) {
        if (this.model.expiredAt < this.model.effectedAt) {
          this.messageService.warning('Ngày kết thúc không hợp lệ');
          return;
        }
        const response = await this.promotionPolicyService.createPromotionPolicy(this.model);
        if (response.errorCode !== 0) {
          this.handleError(response.data);
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
        await this.promotionPolicyService.updatePromotionPolicy(this.model);
        this.loadData();
        CommonHelper.resetForm(this.createPolicyForm);
        this.handleVisibleModal(false);
        this.onFinished.emit();
      } else {
        this.messageService.warning('Vui lòng kiểm tra lại dữ liệu');
        CommonHelper.validateForm(this.createPolicyForm);
      }
    }
  }

  handleError(data: { field: string; message: string }[]) {
    data.forEach(item => {
      this.error[item.field] = item.message;
    });
  }

  onCancelModal() {
    this.reset();
    this.handleVisibleModal(false);
  }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }

  adjustDate(date, hh, mm, ss, ml) {
    date.setHours(hh);
    date.setMinutes(mm);
    date.setSeconds(ss);
    date.setMilliseconds(ml);
  }

  onChangeAffectingDate($event) {
    const date = new Date($event);
    this.adjustDate(date, 0, 0, 0, 0);
    this.model.effectedAt = Number(moment(date).format('x'));
  }

  onChangeExpirationDate($event) {
    const date = new Date($event);
    this.adjustDate(date, 23, 59, 59, 999);
    this.model.expiredAt = Number(moment(date).format('x'));
  }

  reset() {
    if (this.type === 'create') {
      this.model = new PromotionPolicyModel();
      this.effectedDate = null;
      this.expiredDate = null;
    } else {
      this.model = new PromotionPolicyModel(this.data);
      this.effectedDate = new Date(this.data.effectedAt);
      this.expiredDate = new Date(this.data.expiredAt);
    }
    CommonHelper.resetForm(this.createPolicyForm);
  }
}
