import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { EndUser } from '@/modules/customer/models/enduser-detail.model';
import { EndUserService } from '@/modules/customer/services/enduser.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'create-modify-enduser-model',
    templateUrl: './create-modify-enduser-model.component.html'
})
export class CreateModifyEnduserModelComponent implements OnChanges {
    @Input() modifyingModel: EndUser = null;
    @Input() userId: string = null;
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    isProcessing: boolean = false;
    model: EndUser = new EndUser({ status: Status.ACTIVE });

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private enduserService: EndUserService,
    ) { }

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
            this.model = new EndUser({ status: Status.ACTIVE });
        }
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.enduserService.trimData(this.model);
        if (this.createModifyForm.valid && !_.isEmpty(this.model.name) && !_.isEmpty(this.model.phone)) {
            this.isProcessing = true;
            let response;
            if (this.modifyingModel) {
                response = await this.enduserService.updateEnduser(this.model);
            } else {
                this.model.userId = this.userId;
                response = await this.enduserService.createEnduser(this.model);
            }
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.afterSubmit.emit();
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

    cancle() {
        this.reset();
        this.handleVisibleModel(false);
    }

    reset() {
        this.init();
        CommonHelper.resetForm(this.createModifyForm);
    }
}