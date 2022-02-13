import * as _ from 'lodash';
import { CategoriesService } from './../../../../../pages/settings-management/services/categories.service';
import { CategoryModel } from './../../../model/category.model';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'category-editor',
    templateUrl: './category-editor.component.html',
    styleUrls: ['./category-editor.component.less']
})
export class CategoryEditorComponent implements OnChanges {
    @Input() visibleModal: boolean = false;
    @Output() visibleModalChange = new EventEmitter<boolean>();
    @Output() update = new EventEmitter();
    @ViewChild('form') userLevelForm: NgForm;
    @Input() model: CategoryModel = new CategoryModel();
    isProcessing: boolean = false;

    async ngOnChanges() {
        if (this.visibleModal) {
            this.isProcessing = true;
            this.isProcessing = false;
        }
    }

    constructor(
        private messageService: NzMessageService,
        private categoriesService: CategoriesService,
        private translateService: TranslateService
    ) { }

    handleVisibleModal(flag = false) {
        this.visibleModal = !!flag;
        this.visibleModalChange.emit(this.visibleModal);
        if (!this.visibleModal) {
            this.onReset();
        }
    }

    async onCreate() {
        if (this.userLevelForm.valid) {
            this.isProcessing = true;
            const response = this.model._id
                ? await this.categoriesService.update(this.model)
                : await this.categoriesService.create(this.model);
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.onReset();
                this.update.emit();
                this.messageService.success(
                    this.translateService.instant('common.successfully')
                );
                this.handleVisibleModal();
            } else {
                this.messageService.error(response.message);
            }
        } else {
            CommonHelper.validateForm(this.userLevelForm);
        }
    }

    onReset() {
        this.model = new CategoryModel();
        CommonHelper.resetForm(this.userLevelForm);
    }
}
