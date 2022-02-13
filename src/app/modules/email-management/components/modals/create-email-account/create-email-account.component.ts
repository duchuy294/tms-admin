import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EmailAccount } from '@/modules/email-management/const/email-account.const';
import { EmailAccountModel } from '@/modules/email-management/models/email-account.model';
import { EmailAccountService } from '@/modules/email-management/services/email-account.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'create-email-account',
    templateUrl: './create-email-account.component.html',
    styleUrls: ['./create-email-account.component.less']
})

export class CreateEmailAccountComponent {
    @ViewChild('emailAccountForm') emailAccountForm: NgForm;

    modelQuery = new EmailAccountModel();
    visibleModal: boolean = false;
    types = EmailAccount.types;
    statuses = EmailAccount.statuses;
    loadingModal: boolean = false;
    passwordVisible: boolean = false;
    _confirmPassword: string = '';

    @Input()
    set model(value: any) {
        this.modelQuery = value;
    }

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }

    @Input()
    set loading(value: boolean) {
        this.loadingModal = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    @Output() handleLoading = new EventEmitter<boolean>();

    @Output() submit = new EventEmitter<{
        success?: boolean;
        message?: string;
        type?: string;
    }>();

    constructor(
        private emailAccountService: EmailAccountService
    ) { }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag = false) {
        this.handleLoading.emit(!!flag);
    }

    reset() {
        this.modelQuery = new EmailAccountModel();
        this._confirmPassword = '';
        CommonHelper.resetForm(this.emailAccountForm);
    }

    async onCreateEmailAccount() {
        this.handleLoadingModal(true);
        this.modelQuery = this.emailAccountService.trimData(this.modelQuery);
        if (this.emailAccountForm.valid) {
            if (!this.modelQuery.name || !this.modelQuery.email || !this.modelQuery.type || !this.modelQuery.host || !this.modelQuery.port
                || (!this.modelQuery._id && (!this.modelQuery['password'] || this.modelQuery['password'] !== this._confirmPassword))) {
                this.handleLoadingModal(false);
                return;
            }
            const response = await this.emailAccountService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.emailAccountForm);
        }
    }
}