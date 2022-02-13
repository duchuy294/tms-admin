import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProviderService } from '@/modules/telecom/services/provider.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'change-provider-password',
  templateUrl: './change-provider-password.component.html'
})
export class ChangeProviderPasswordComponent {
  @Input() providerId: string = '';
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<{
    success?: boolean;
    message?: string;
  }>();
  @ViewChild('changeProviderPasswordForm') changeProviderPasswordForm: NgForm;
  isProcessing: boolean = false;
  private _confirmPassword: string = null;
  private _newPassword: string = null;
  private _oldPassword: string = null;

  constructor(
    private messageService: NzMessageService,
    private providerService: ProviderService,
    private translateService: TranslateService
  ) { }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }

  handleLoadingModal(flag = true) {
    this.isProcessing = flag;
  }

  reset() {
    this._oldPassword = null;
    this._newPassword = null;
    this._confirmPassword = null;
    CommonHelper.resetForm(this.changeProviderPasswordForm);
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  async onChangeProviderPassword() {
    let model = { oldPassword: this._oldPassword, newPassword: this._newPassword, confirmPassword: this._confirmPassword, _id: this.providerId };
    model = this.providerService.trimData(model);
    this._confirmPassword = model.confirmPassword;
    this._newPassword = model.newPassword;
    this._oldPassword = model.oldPassword;
    this.handleLoadingModal(true);
    if (this.changeProviderPasswordForm.valid) {
      if (!model['oldPassword'] || !model['newPassword'] || model['newPassword'] !== this._confirmPassword) {
        this.handleLoadingModal(false);
        return;
      }
      const response = await this.providerService.changePassword(model);
      if (response.errorCode === 0) {
        this.messageService.success(
          this.translateService.instant('telecom.providers-change-password.success')
        );
        this.reset();
        this.handleVisibleModal(false);
      } else {
        this.messageService.error(response.message);
      }
      this.submit.emit(response);
    } else {
      CommonHelper.validateForm(this.changeProviderPasswordForm);
    }
    this.handleLoadingModal(false);
  }
}
