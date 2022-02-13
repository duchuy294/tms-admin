import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from '@/models/query.model';
import { ResetPasswordComponent } from './../../../../../modules/utility/components/reset-password/reset-password.component';
import { ServicerGridComponent } from './../../../../../modules/servicer/components/servicer-grid/servicer-grid.component';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'servicer-management',
    templateUrl: 'servicer-management.component.html'
})
export class ServicerManagementComponent implements OnInit {
    public searchValue: string;
    public displayFilter: boolean = false;
    public displayCreate: boolean = false;
    public query = new QueryModel();
    public searchAll: boolean = true;
    visibleModal: boolean = false;
    servicerId = '';
    visiblePasswordForm = false;
    loadingPasswordForm = false;
    @ViewChild('servicerGrid')
    servicerGrid: ServicerGridComponent;
    @ViewChild('servicerResetPassword')
    servicerResetPassword: ResetPasswordComponent;
    type = 'servicer';
    ngOnInit() {
        window.scrollTo(0, 0);
    }
    constructor(
        private readonly translateService: TranslateService,
        private readonly messageService: NzMessageService,
        private modalService: NzModalService,
        private service: ServicerService
    ) { }

    async search(query: QueryModel = new QueryModel({ status: null })) {
        this.servicerGrid.triggerLoadData(query);
    }

    async openServicerModal() {
        this.visibleModal = true;
    }

    async resetPassword(servicerId: string) {
        this.servicerId = servicerId;
        this.handleShowPasswordForm(true);
    }

    handleShowPasswordForm(flag = true) {
        this.visiblePasswordForm = !!flag;
        if (!flag) {
            this.servicerResetPassword.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingPasswordForm = !!flag;
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

    confirmDelete(id: string) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.delete(id),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async delete(id: string) {
        const response = await this.service.deleteServicer(id);
        if (response) {
            this.messageService.success(
                this.translateService.instant('common.sucessful-delete')
            );
            await this.servicerGrid.loadData();
        } else {
            this.messageService.error(
                this.translateService.instant('common.unsucessful-delete')
            );
        }
    }
}