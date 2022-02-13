import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SmsTemplate } from '@/modules/telecom/const/sms-template.const';
import { SmsTemplateModel } from '@/modules/telecom/models/sms-template.model';
import { SmsTemplateService } from '@/modules/telecom/services/sms-template.service';

@Component({
    selector: 'create-sms-template',
    templateUrl: './create-sms-template.component.html',
    styleUrls: ['./create-sms-template.component.less']
})

export class CreateSmsTemplateComponent {
    @ViewChild('smsTemplateForm') smsTemplateForm: NgForm;
    loadingModal: boolean = false;
    modelQuery = new SmsTemplateModel();
    statuses = SmsTemplate.statuses;
    types = SmsTemplate.types;
    visibleModal: boolean = false;

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
        private smsTemplateService: SmsTemplateService
    ) { }

    handleVisibleModal(flag?) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag?) {
        this.handleLoading.emit(!!flag);
    }

    reset() {
        this.modelQuery = new SmsTemplateModel();
        CommonHelper.resetForm(this.smsTemplateForm);
    }

    async onCreateSmsTemplate() {
        this.handleLoadingModal(true);
        this.modelQuery = this.smsTemplateService.trimData(this.modelQuery);
        if (this.smsTemplateForm.valid) {
            if (!this.modelQuery.content || !this.modelQuery.type) {
                this.handleLoadingModal(false);
                return;
            }
            const response = await this.smsTemplateService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.smsTemplateForm);
        }
    }
}