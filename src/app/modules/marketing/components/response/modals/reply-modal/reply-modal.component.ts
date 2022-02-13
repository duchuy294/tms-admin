import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReplyModel } from '@/modules/marketing/models/response';
import { ResponseService } from '@/modules/marketing/services/response.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reply-modal',
  templateUrl: './reply-modal.component.html',
  styleUrls: ['./reply-modal.component.less']
})
export class ReplyModalComponent implements OnChanges {
  model: ReplyModel = new ReplyModel();
  loadingReply: boolean = false;

  @Input() response: any;
  @Input() visible: boolean = false;

  @Output() handleVisible = new EventEmitter();
  @Output() afterReply = new EventEmitter();
  @ViewChild('replyResponseForm') replyResponseForm: NgForm;

  constructor(
    private messageService: NzMessageService,
    private responseService: ResponseService,
    private translateService: TranslateService,
  ) { }

  ngOnChanges(): void {
    if (this.response && this.visible) {
      this.model.title = `${this.translateService.instant('actions.reply')} ${this.translateService.instant('common.responseRate').toLowerCase()} #${this.response.code}`;
    }
  }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  async submit() {
    if (this.loadingReply) {
      return;
    }
    this.model = this.responseService.trimData(this.model);
    if (_.isEmpty(this.model.title) || _.isEmpty(this.model.content)) {
      return;
    }
    if (this.replyResponseForm.valid) {
      this.model.responseId = this.response._id;
      this.loadingReply = true;
      const response = await this.responseService.reply(this.model);
      if (response.errorCode === 0) {
        this.messageService.success(this.translateService.instant('marketing.response.replySuccessfully'));
        this.afterReply.emit();
        this.handleVisibleModal(false);
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
      this.loadingReply = false;
    } else {
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
      CommonHelper.validateForm(this.replyResponseForm);
    }
  }

  reset() {
    this.model = new ReplyModel();
    CommonHelper.resetForm(this.replyResponseForm);
  }
}
