import * as _ from 'lodash';
import { AccountGroupModel } from 'app/modules/admin/models/account-group.model';
import { AccountModel } from '../../../../modules/admin/models/admin.model';
import { AdminPermission } from './../../../../constants/AdminPermissions';
import { AdminRole } from '../../../../constants/AdminRole';
import { AdminService } from '../../../../modules/admin/services/admin.service';
import { BranchModel } from 'app/modules/admin/models/branch.model';
import { BranchService } from 'app/modules/admin/services/branch.service';
import { CommonHelper } from './../../../../modules/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from 'app/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'create-account',
    templateUrl: './create-account.component.html'
})
export class CreateAccountComponent implements OnChanges, OnInit {
    @Input() modifyingModel: AccountModel = null;
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter<boolean>();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    isProcessing: boolean = false;
    model = new AccountModel();
    public adminRoles = AdminPermission;
    public levels = [
        AdminRole.ADMIN,
        AdminRole.OPERATION,
        AdminRole.ADMINISTRATION,
        AdminRole.HUMAN_RESOURCE,
        AdminRole.PARTNER_LEADER
    ];
    public groups: AccountGroupModel[] = [];
    public branches: BranchModel[] = [];

    constructor(
        private service: AdminService,
        private brancheService: BranchService,
        private translateService: TranslateService,
        private messageService: NzMessageService
    ) { }

    async ngOnInit() {
        this.groups = (await this.service.getGroupAdmins()).data;
        this.branches = (await this.brancheService.filter(new QueryModel({ limit: 1000 }))).data;
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
            this.model = new AccountModel({ groupId: this.groups[0]._id, branchId: this.branches[0]._id });
        }
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.service.trimData(this.model);
        if (this.createModifyForm.valid && !_.isEmpty(this.model.fullName) && !_.isEmpty(this.model.phone) && !_.isEmpty(this.model.address)) {
            this.isProcessing = true;
            let response;
            if (this.modifyingModel) {
                response = await this.service.updateAdmin(this.model);
            } else {
                response = await this.service.createAdmin(this.model);
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