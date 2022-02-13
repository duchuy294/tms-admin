import * as _ from 'lodash';
import { AccountGroupModel } from './../../../../modules/admin/models/account-group.model';
import { AdminService } from './../../../../modules/admin/services/admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridGroupAdminComponent } from './grid-group-admin/grid-group-admin.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from './../../../../models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'group-admins',
    templateUrl: './group-admins.component.html'
})
export class GroupAdminsComponent implements OnInit {
    @ViewChild('gridGroupAdmin')
    gridGroupAdmin: GridGroupAdminComponent;
    modifyingModel = new AccountGroupModel();
    createModifyModalVisible = false;

    constructor(
        private modalService: NzModalService,
        private translateService: TranslateService,
        private messageService: NzMessageService,
        private service: AdminService
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    handleModelVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
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
        const response = await this.service.deleteGroupAdmin(id);
        if (response) {
            this.messageService.success(
                this.translateService.instant('common.sucessful-delete')
            );
            await this.gridGroupAdmin.getData();
        } else {
            this.messageService.error(this.translateService.instant('common.unsucessful-delete')
            );
        }
    }

    create() {
        this.modifyingModel = null;
        this.handleModelVisible(true);
    }

    handleAfterSubmit(loading = false) {
        if (loading) {
            const query = new QueryModel({ status: null });
            this.gridGroupAdmin.getData(query);
        } else {
            this.gridGroupAdmin.getData();
        }
    }

    async modify(id: string = null) {
        this.modifyingModel = await this.service.getGroupAdmin(id);
        this.handleModelVisible(true);
    }
}