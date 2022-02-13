import { ChangePasswordEmailAccountComponent } from './../modals/change-password-email-account/change-password-email-account.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateEmailAccountComponent } from './../modals/create-email-account/create-email-account.component';
import { EmailAccountGridComponent } from './../email-account-grid/email-account-grid.component';
import { EmailAccountModel } from '../../models/email-account.model';
import { EmailAccountQueryModel } from '../../models/email-account-query.model';
import { EmailAccountService } from '../../services/email-account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from './../../../../models/query.model';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'email-account-list',
    templateUrl: './email-account-list.component.html'
})
export class EmailAccountListComponent implements OnInit {
    @ViewChild('createEmailAccount') createEmailAccount: CreateEmailAccountComponent;
    @ViewChild('emailAccountGrid') emailAccountGrid: EmailAccountGridComponent;
    @ViewChild('changePasswordEmailAccount')
    changePasswordEmailAccount: ChangePasswordEmailAccountComponent;
    modelQuery = new EmailAccountQueryModel();
    model = new EmailAccountModel();
    loading: boolean = false;
    showFilter: boolean = false;
    visibleModel: boolean = false;
    loadingModel: boolean = false;
    changePasswordVisibleModel: boolean = false;
    password = {};

    constructor(
        private emailAccountService: EmailAccountService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE}`;
    }

    async edit(emailAccountId: string = null) {
        this.model = await this.emailAccountService.get(emailAccountId);
        this.handleVisible(true);
    }

    async changePassword(emailAccountId: string = null) {
        this.password = { _id: emailAccountId };
        this.handleChangePasswordVisible(true);
    }

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }

    async search(event = new QueryModel()) {
        this.modelQuery = event;
        await this.emailAccountGrid.loadData(this.modelQuery);
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    $event.type === 'create'
                        ? 'email.template.status-create-complete'
                        : 'email.template.status-edit-complete'
                )
            );
            await this.emailAccountGrid.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createEmailAccount.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingModel = !!flag;
    }

    handleChangePasswordVisible(flag = true) {
        this.changePasswordVisibleModel = !!flag;
        if (!flag) {
            this.changePasswordEmailAccount.reset();
        }
    }
}
