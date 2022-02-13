import * as _ from 'lodash';
import { AccountGroupModel } from 'app/modules/admin/models/account-group.model';
import { AdminRole } from '../../../../../constants/AdminRole';
import { AdminService } from '../../../../../modules/admin/services/admin.service';
import { CommonHelper } from './../../../../../modules/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { UserStatus } from './../../../../../constants/UserStatus';

@Component({
    selector: 'create-group-admin',
    templateUrl: './create-group-admin.component.html'
})
export class CreateGroupAdminComponent implements OnChanges {
    @Input() modifyingModel: AccountGroupModel = null;
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter<boolean>();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    isProcessing: boolean = false;
    model = new AccountGroupModel({ status: UserStatus.NEW });
    statuses: UserStatus[] = [
        UserStatus.NEW,
        UserStatus.ACTIVE,
        UserStatus.SUSPENDED,
        UserStatus.DELETED
    ];
    public levels = [
        AdminRole.ADMIN,
        AdminRole.OPERATION,
        AdminRole.ADMINISTRATION,
        AdminRole.HUMAN_RESOURCE,
        AdminRole.PARTNER_LEADER
    ];
    constructor(
        private service: AdminService,
        private messageService: NzMessageService,
        private translateService: TranslateService
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
            this.model = new AccountGroupModel({ status: UserStatus.NEW });
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
                response = await this.service.updateGroupAdmin(this.model);
            } else {
                response = await this.service.createGroupAdmin(this.model);
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