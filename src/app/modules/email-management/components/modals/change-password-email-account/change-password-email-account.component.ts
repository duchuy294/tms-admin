import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EmailAccountModel } from '@/modules/email-management/models/email-account.model';
import { EmailAccountService } from '@/modules/email-management/services/email-account.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'change-password-email-account',
    templateUrl: './change-password-email-account.component.html',
    styleUrls: ['./change-password-email-account.component.less']
})

export class ChangePasswordEmailAccountComponent {
    @ViewChild('changePasswordEmailAccountForm') changePasswordEmailAccountForm: NgForm;

    modelQuery = {};
    visibleModal: boolean = false;
    _confirmPassword: string = '';
    passwordVisible: boolean = false;
    loadingModal: boolean = false;

    @Input()
    set model(value: any) {
        this.modelQuery = value;
    }

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    constructor(
        private emailAccountService: EmailAccountService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(flag);
    }

    reset() {
        this.modelQuery = { _id: this.modelQuery || '' };
        this._confirmPassword = '';
        CommonHelper.resetForm(this.changePasswordEmailAccountForm);
    }

    async onChangePasswordEmailAccount() {
        this.loadingModal = true;
        this.modelQuery = this.emailAccountService.trimData(this.modelQuery);
        if (this.changePasswordEmailAccountForm.valid) {
            if (!this.modelQuery['oldPassword'] || !this.modelQuery['newPassword'] || this.modelQuery['newPassword'] !== this._confirmPassword) {
                this.loadingModal = false;
                return;
            }
            const response = await this.emailAccountService.changePassword(this.modelQuery);
            if (response.success) {
                this.messageService.success(
                    this.translateService.instant('email.account.status-change-password-complete')
                );
                this.modelQuery = new EmailAccountModel();
                this.handleVisibleModal(false);
            } else {
                this.messageService.error(response.message);
            }
        } else {
            CommonHelper.validateForm(this.changePasswordEmailAccountForm);
        }
        this.loadingModal = false;
    }
}
