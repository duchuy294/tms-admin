import { BankModel } from '@/modules/finance/models/bank.model';
import { BankService } from '@/modules/finance/services/bank.service';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFileType } from '@/constants/nz-upload-file-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'create-bank',
    templateUrl: './create-bank.component.html',
    styleUrls: ['./create-bank.component.less']
})
export class CreateBankComponent {
    visibleModal: boolean = false;
    modelQuery = new BankModel();
    image = [];
    fileType = NzUploadFileType.IMAGE;
    loadingModal: boolean = false;

    @ViewChild('bankForm') bankForm: NgForm;

    constructor(
        private messageService: NzMessageService,
        private bankService: BankService,
        private translateService: TranslateService
    ) { }

    @Input()
    set model(value) {
        this.modelQuery = value;
        if (this.modelQuery.image) {
            this.image = [{ url: this.modelQuery.image }];
        }
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

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag = false) {
        this.handleLoading.emit(!!flag);
    }

    updateContentImg($event) {
        this.modelQuery.image = $event[0] || '';
    }

    reset() {
        this.modelQuery = new BankModel();
        this.image = [];
        CommonHelper.resetForm(this.bankForm);
    }

    async onCreateBank() {
        this.handleLoadingModal(true);
        this.modelQuery = this.bankService.trimData(this.modelQuery);
        if (this.bankForm.valid) {
            if (!this.modelQuery.name || !this.modelQuery.phone) {
                this.handleLoadingModal(false);
                return;
            }
            if (!this.modelQuery.image) {
                this.messageService.warning(this.translateService.instant('validations-form.avatar.required'));
                this.handleLoadingModal(false);
                return;
            }
            if (!this.modelQuery.address.cityId || !this.modelQuery.address.districtId || !this.modelQuery.address.street || !this.modelQuery.address.ward) {
                this.messageService.warning(this.translateService.instant('validations-form.address.required'));
                this.handleLoadingModal(false);
                return;
            }

            const response = await this.bankService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.bankForm);
        }
    }
}