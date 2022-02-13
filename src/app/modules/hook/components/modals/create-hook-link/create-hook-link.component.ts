import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Hook } from '@/modules/hook/const/hook.const';
import { HookLinkModel } from '@/modules/hook/models/hook-link.model';
import { HookLinkService } from '@/modules/hook/services/hook-link.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'create-hook-link',
    templateUrl: './create-hook-link.component.html',
    styleUrls: ['./create-hook-link.component.less']
})

export class CreateHookLinkComponent {
    @ViewChild('hookLinkForm') hookLinkForm: NgForm;
    @Input()
    set model(value) {
        this.modelQuery = value;
        if (this.modelQuery.servicerId) {
            this.selectedUser = this.modelQuery.servicerId;
            this.selectedTarget = 'servicer';
        } else {
            this.selectedUser = this.modelQuery.userId;
            this.selectedTarget = 'customer';
        }
    }
    @Input() visible = false;
    @Input() loading = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() handleLoading = new EventEmitter<boolean>();
    @Output() submit = new EventEmitter<{
        success?: boolean;
        message?: string;
        type?: string;
    }>();
    modelQuery = new HookLinkModel();
    types = Hook.types;
    selectedTarget = 'customer';
    selectedUser = null;

    constructor(
        private hookLinkService: HookLinkService,
        private translateService: TranslateService,
        private messageService: NzMessageService
    ) { }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag = false) {
        this.handleLoading.emit(!!flag);
    }

    reset() {
        this.modelQuery = new HookLinkModel();
        this.selectedTarget = 'customer';
        this.selectedUser = null;
        CommonHelper.resetForm(this.hookLinkForm);
    }

    async onCreateHookLink() {
        this.handleLoadingModal(true);
        this.modelQuery = this.hookLinkService.trimData(this.modelQuery);
        if (this.hookLinkForm.valid) {
            if (!this.selectedUser) {
                this.messageService.warning(this.translateService.instant('validations-form.customer-servicer.required'));
                this.handleLoadingModal(false);
                return;
            }
            if (!this.modelQuery.link) {
                this.handleLoadingModal(false);
                return;
            }
            if (this.selectedTarget === 'customer') {
                delete this.modelQuery.servicerId;
                this.modelQuery.userId = this.selectedUser;
            } else {
                delete this.modelQuery.userId;
                this.modelQuery.servicerId = this.selectedUser;
            }
            const response = await this.hookLinkService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.hookLinkForm);
        }
    }

    handleRadioChange() {
        this.selectedUser = null;
    }
}