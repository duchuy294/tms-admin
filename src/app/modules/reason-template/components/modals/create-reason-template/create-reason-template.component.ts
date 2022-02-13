import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFileType } from '@/constants/nz-upload-file-type.enum';
import { ReasonTemplateModel } from '@/modules/reason-template/models/reason-template.model';
import { ReasonTemplateService } from '@/modules/reason-template/services/reason-template.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'create-reason-template',
    templateUrl: './create-reason-template.component.html',
    styleUrls: ['./create-reason-template.component.less']
})

export class CreateReasonTemplateComponent implements OnInit {
    @ViewChild('reasonTemplateForm') reasonTemplateForm: NgForm;

    modelQuery = new ReasonTemplateModel();
    visibleModal: boolean = false;
    loadingModal: boolean = false;
    image = [];
    selectedImage = [];
    fileType = NzUploadFileType.IMAGE;
    modelType: string = '';

    @Input()
    set model(value: any) {
        this.modelQuery = value;
        if (this.modelQuery.image) {
            this.image = [{ url: this.modelQuery.image }];
        }

        if (this.modelQuery.selectedImage) {
            this.selectedImage = [{ url: this.modelQuery.selectedImage }];
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

    @Input()
    set type(value: string) {
        this.modelType = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    @Output() handleLoading = new EventEmitter<boolean>();

    @Output() submit = new EventEmitter<{
        success?: boolean;
        message?: string;
        type?: string;
    }>();

    constructor(
        private reasonTemplateService: ReasonTemplateService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.modelQuery.type = this.modelType;
    }

    handleVisibleModal(flag?) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag?) {
        this.handleLoading.emit(!!flag);
    }

    reset() {
        this.modelQuery = new ReasonTemplateModel();
        this.image = [];
        this.selectedImage = [];
        this.modelQuery.type = this.modelType;
        CommonHelper.resetForm(this.reasonTemplateForm);
    }

    async onCreateReasonTemplate() {
        this.handleLoadingModal(true);
        this.modelQuery = this.reasonTemplateService.trimData(this.modelQuery);
        if (this.reasonTemplateForm.valid) {
            if (!this.modelQuery.name || !this.modelQuery.order) {
                this.handleLoadingModal(false);
                return;
            }

            if (!this.modelQuery.image) {
                this.messageService.warning(this.translateService.instant('validations-form.avatar.required'));
                this.handleLoadingModal(false);
                return;
            }

            if (!this.modelQuery.selectedImage) {
                this.messageService.warning(this.translateService.instant('validations-form.selectedImage.required'));
                this.handleLoadingModal(false);
                return;
            }

            const response = await this.reasonTemplateService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.reasonTemplateForm);
        }
    }

    updateContentImg($event, img = '') {
        this.modelQuery[img] = $event[0] || '';
    }

    beforeUpload = (file: File) => {
        const imageTypeValidated = this.imageTypeValidation(file);
        if (!imageTypeValidated) {
            this.messageService.warning(this.translateService.instant('validations-form.image.type'));
        }
        return imageTypeValidated;
    }

    imageTypeValidation(file) {
        const types = _.split(this.fileType, ',');
        if (types.includes(file.type)) {
            return true;
        }
        return false;
    }
}