import * as _ from 'lodash';
import { CommonHelper } from './../../../../../utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RewardCategoryModel } from 'app/modules/marketing/models/reward-category.model';
import { RewardCategoryService } from 'app/modules/marketing/services/reward-category.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'reward-category-modify',
    templateUrl: 'reward-category-modify.component.html'
})
export class RewardCategoryModifyComponent implements OnChanges {
    model: RewardCategoryModel = new RewardCategoryModel();
    @Input() modifyingModel: RewardCategoryModel = null;
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter<boolean>();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    isProcessing: boolean = false;
    images = [];

    constructor(
        private rewardCategoryService: RewardCategoryService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    ngOnChanges() {
        if (this.visible) {
            this.init();
        }
    }

    init() {
        this.isProcessing = true;
        if (this.modifyingModel) {
            this.model = _.cloneDeep(this.modifyingModel);
            if (this.model.image) {
                this.images = [this.model.image].map(image => {
                    return {
                        url: image,
                        status: 'done'
                    };
                });
            }
        } else {
            this.model = new RewardCategoryModel();
        }
        this.isProcessing = false;
    }

    handleVisibleModel(flag: boolean = false) {
        this.handleVisible.emit(!!flag);
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.rewardCategoryService.trimData(this.model);
        if (this.createModifyForm.valid && !_.isEmpty(this.model.name)) {
            this.isProcessing = true;
            let response;
            if (this.modifyingModel) {
                response = await this.rewardCategoryService.update(this.model);
            } else {
                response = await this.rewardCategoryService.create(this.model);
            }
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.afterSubmit.emit(this.modifyingModel ? false : true);
                this.handleVisibleModel(false);
                this.messageService.success(`${this.translateService.instant(`actions.${this.modifyingModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
                this.reset();
            } else {
                this.messageService.error(response.message);
                this.messageService.warning(this.translateService.instant('common.invalid-data'));
            }
        } else {
            CommonHelper.validateForm(this.createModifyForm);
            this.messageService.warning(this.translateService.instant('common.invalid-data'));
        }
    }

    cancel() {
        this.reset();
        this.handleVisibleModel(false);
    }

    reset() {
        this.init();
        CommonHelper.resetForm(this.createModifyForm);
    }

    uploadImage(images: string[]) {
        this.model.image = images.length > 0 ? images[images.length - 1] : null;
    }
}