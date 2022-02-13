import * as _ from 'lodash';
import { AccountModel } from './../../../../modules/admin/models/admin.model';
import { AdminService } from './../../../../modules/admin/services/admin.service';
import { AdminsGridComponent } from './../admins-grid/admins-grid.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from './../../../../models/query.model';
import { ResetPasswordComponent } from './../../../../modules/utility/components/reset-password/reset-password.component';
import { Status } from './../../../../constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'admins',
    templateUrl: './admins.component.html'
})
export class AdminsComponent implements OnInit {
    @ViewChild('adminGrid')
    adminGrid: AdminsGridComponent;
    @ViewChild('adminResetPassword')
    adminResetPassword: ResetPasswordComponent;
    adminId = '';
    type = 'admin';
    visiblePasswordForm = false;
    loadingPasswordForm = false;
    createModifyModalVisible = false;
    modifyingModel = new AccountModel();
    constructor(
        private modalService: NzModalService,
        private translateService: TranslateService,
        private messageService: NzMessageService,
        private service: AdminService
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    async modify(id) {
        this.modifyingModel = await this.service.getAdmin(id);
        this.handleModelVisible(true);
    }

    create() {
        this.modifyingModel = null;
        this.handleModelVisible(true);
    }

    async search(query: QueryModel) {
        this.adminGrid.triggerLoadData(query);
    }
    handleShowPasswordForm(flag = true) {
        this.visiblePasswordForm = !!flag;
        if (!flag) {
            this.adminResetPassword.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingPasswordForm = !!flag;
    }

    handleVisible(flag = true) {
        this.visiblePasswordForm = !!flag;
        if (!flag) {
            this.adminResetPassword.reset();
        }
    }

    async submit($event) {
        if ($event.success) {
            this.handleShowPasswordForm(false);
            this.messageService.success(
                this.translateService.instant(
                    'settings.createAccount.edit-sucessful-password'
                )
            );
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    async resetPassword(adminId: string) {
        this.adminId = adminId;
        this.handleVisible(true);
    }

    confirmDelete(id: string) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.delete(id),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async delete(id: string) {
        const response = await this.service.deleteAdmin(id);
        if (response) {
            this.messageService.success(this.translateService.instant('common.sucessful-delete')
            );
            await this.adminGrid.getData();
        } else {
            this.messageService.error(this.translateService.instant('common.sucessful-delete')
            );
        }
    }

    handleModelVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }

    handleAfterSubmit(loading = false) {
        if (loading) {
            const query = new QueryModel();
            this.adminGrid.triggerLoadData(query);
        } else {
            this.adminGrid.getData();
        }
    }

    confirmActivate({ id = null, active = false }) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
            nzOnOk: () => this.activate(id, active),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('button.confirm')
        });
    }

    async activate(id: string = null, active = false) {
        const adminData = await this.service.getAdmin(id);
        if (active) {
            adminData.status = Status.ACTIVE;
        } else {
            adminData.status = Status.DELETED;
        }
        const response = await this.service.updateAdmin(adminData);
        this.handleAfterSubmit(false);
        if (response.errorCode === 0) {
            this.messageService.success(`${this.translateService.instant('common.successfully')}`);
        } else {
            this.messageService.error(`${this.translateService.instant('common.failed')}`);
        }
    }
}