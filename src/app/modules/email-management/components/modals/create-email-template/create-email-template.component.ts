import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EmailTemplate } from '@/modules/email-management/const/email-template.const';
import { EmailTemplateModel } from '@/modules/email-management/models/email-template.model';
import { EmailTemplateService } from '@/modules/email-management/services/email-template.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'create-email-template',
    templateUrl: './create-email-template.component.html',
    styleUrls: ['./create-email-template.component.less']
})

export class CreateEmailTemplateComponent {
    @ViewChild('emailTemplateForm') emailTemplateForm: NgForm;

    modelQuery = new EmailTemplateModel();
    visibleModal: boolean = false;
    types = EmailTemplate.types;
    statuses = EmailTemplate.statuses;
    loadingModal: boolean = false;

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
        private emailTemplateService: EmailTemplateService
    ) { }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag = false) {
        this.handleLoading.emit(!!flag);
    }

    reset() {
        this.modelQuery = new EmailTemplateModel();
        CommonHelper.resetForm(this.emailTemplateForm);
    }

    async onCreateEmailTemplate() {
        this.handleLoadingModal(true);
        this.modelQuery = this.emailTemplateService.trimData(this.modelQuery);
        if (this.emailTemplateForm.valid) {
            if (!this.modelQuery.title || !this.modelQuery.content || !this.modelQuery.type) {
                this.handleLoadingModal(false);
                return;
            }
            const response = await this.emailTemplateService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.emailTemplateForm);
        }
    }
}