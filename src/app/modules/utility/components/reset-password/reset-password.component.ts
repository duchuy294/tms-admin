import * as _ from 'lodash';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent {
  @ViewChild('resetPasswordForm') resetPasswordForm: NgForm;
  password: string = '';
  rePassword: string = '';
  id: string = '';
  visiblePasswordForm: boolean = false;
  loadingPasswordForm: boolean = false;
  TYPE = { customer: 'customer', servicer: 'servicer', admin: 'admin' };
  @Input() type = '';

  @Input()
  set model(value: any) {
    this.id = value;
  }

  @Input()
  set visible(value: boolean) {
    this.visiblePasswordForm = value;
  }

  @Input()
  set loading(value: boolean) {
    this.loadingPasswordForm = value;
  }

  @Output() handleVisible = new EventEmitter<boolean>();

  @Output() handleLoading = new EventEmitter<boolean>();

  @Output() submit = new EventEmitter<{
    success?: boolean;
    message?: string;
  }>();

  constructor(
    private customerService: CustomerService,
    private servicerService: ServicerService,
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private adminService: AdminService) {
  }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }

  handleLoadingModal(flag?) {
    this.handleLoading.emit(!!flag);
  }

  reset() {
    this.password = '';
    this.rePassword = '';
    CommonHelper.resetForm(this.resetPasswordForm);
  }

  async update() {
    this.handleLoadingModal(true);
    if (this.resetPasswordForm.valid) {
      if (this.password !== this.rePassword) {
        this.handleLoadingModal(false);
        this.messageService.warning(
          this.translateService.instant('profile-info.password-not-match')
        );
        return;
      }
      if (this.type) {
        let response;
        switch (this.type) {
          case this.TYPE.customer:
            response = await this.customerService.resetPassword(this.id, this.password);
            break;
          case this.TYPE.servicer:
            response = await this.servicerService.resetPassword(this.id, this.password);
            break;
          case this.TYPE.admin:
            response = await this.adminService.resetPassword(this.id, this.password);
            break;
          default:
            response = {
              success: false,
              message: this.translateService.instant('settings.createAccount.failed-change-password')
            };
            break;
        }
        this.submit.emit({
          ...response
        });
      } else {
        this.handleLoadingModal(false);
        CommonHelper.validateForm(this.resetPasswordForm);
      }
    } else {
      CommonHelper.validateForm(this.resetPasswordForm);
    }
  }
}