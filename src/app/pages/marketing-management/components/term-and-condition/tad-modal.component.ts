import * as _ from 'lodash';
import { CommonHelper } from './../../../../modules/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TADModel } from 'app/modules/marketing/models/TAD.model';
import { TADService } from 'app/modules/marketing/services/tad.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'tad-modal',
    templateUrl: 'tad-modal.component.html'
})
export class TADModalComponent implements OnChanges {
    @Input() modifyingModel: TADModel = null;
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter<boolean>();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    user = 'user';
    servicer = 'servicer';
    userTypes = [this.user, this.servicer];
    model = new TADModel({ userType: this.user });
    isProcessing: boolean = false;

    constructor(public tadService: TADService,
        private messageService: NzMessageService,
        private translateService: TranslateService) {
    }

    ngOnChanges() {
        if (this.visible) {
            this.init();
        }
    }

    handleVisibleModel(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    init() {
        if (this.modifyingModel) {
            this.model = _.cloneDeep(this.modifyingModel);
        } else {
            this.model = new TADModel({ userType: this.user });
        }
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.tadService.trimData(this.model);
        if (this.createModifyForm.valid && !_.isEmpty(this.model.title)) {
            this.isProcessing = true;
            let response;
            if (this.modifyingModel) {
                response = await this.tadService.update(this.model);
            } else {
                response = await this.tadService.create(this.model);
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
}
