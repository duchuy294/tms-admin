import * as _ from 'lodash';
import { AccountType } from '@/constants/AccountType';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NewsCategoryModel } from '@/modules/news/models/news-category.model';
import { NewsCategoryService } from '@/modules/news/services/news-category.service';
import { NgForm } from '@angular/forms';
import { NzUploadFileType } from '@/constants/nz-upload-file-type.enum';

@Component({
    selector: 'create-modify-news-category',
    templateUrl: './create-modify-news-category.component.html',
    styleUrls: ['./create-modify-news-category.component.less']
})

export class CreateModifyNewsCategoryComponent {
    @ViewChild('newsCategoryForm') newsCategoryForm: NgForm;

    image = [];
    modelQuery = new NewsCategoryModel();
    visibleModal: boolean = false;
    loadingModal: boolean = false;
    fileType = NzUploadFileType.IMAGE;
    userType = [AccountType.USER, AccountType.SERVICER];

    @Input()
    set model(value: any) {
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

    constructor(
        private newsCategoryService: NewsCategoryService
    ) { }

    handleVisibleModal(flag?) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag?) {
        this.handleLoading.emit(!!flag);
    }

    reset() {
        this.modelQuery = new NewsCategoryModel();
        this.image = [];
        CommonHelper.resetForm(this.newsCategoryForm);
    }

    async onCreateNewsCategory() {
        this.handleLoadingModal(true);
        if (this.newsCategoryForm.valid) {
            const response = await this.newsCategoryService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.newsCategoryForm);
        }
    }

    updateContentImg($event) {
        this.modelQuery.image = $event[0] || '';
    }
}