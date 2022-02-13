import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { GroupServicerDetail } from './../../../../../modules/servicer/models/group-servicer/group-servicer-detail.model';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ServicerService } from '../../../../../modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';
import { UserStatus } from '@/constants/UserStatus';

@Component({
    selector: 'group-servicer-modify',
    templateUrl: 'group-servicer-modify.component.html'
})
export class GroupServicerModifyComponent implements OnChanges {
    @Input() modifyingModel: GroupServicerDetail = null;
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter<boolean>();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    isProcessing: boolean = false;
    model = new GroupServicerDetail({ status: UserStatus.ACTIVE });
    statuses: UserStatus[] = [
        UserStatus.NEW,
        UserStatus.ACTIVE,
        UserStatus.SUSPENDED,
        UserStatus.DELETED
    ];

    constructor(private service: ServicerService,
        private messageService: NzMessageService,
        private translateService: TranslateService) { }

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
            this.model = new GroupServicerDetail({ status: UserStatus.ACTIVE });
        }
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.service.trimData(this.model);
        if (this.createModifyForm.valid && !_.isEmpty(this.model.name)) {
            this.isProcessing = true;
            let response;
            if (this.modifyingModel) {
                response = await this.service.updateGroupServicer(this.model);
            } else {
                response = await this.service.createGroupServicer(this.model.name);
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