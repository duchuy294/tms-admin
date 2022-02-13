import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerGridComponent } from './../customer-grid/customer-grid.component';
import { CustomerQueryModel } from '@/modules/customer/models/customer-query.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from './../../../../../models/query.model';
import { ResetPasswordComponent } from './../../../../utility/components/reset-password/reset-password.component';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelModel } from '@/modules/user/models/user-level.model';
import { UserLevelService } from './../../../../user/services/user-level.service';

@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {
    public customers: Customer[] = [];
    public searchValue: string;
    public filterVisible: boolean = false;
    public pagingModel: PagingModel<Customer> = new PagingModel<Customer>();
    public query: CustomerQueryModel = new CustomerQueryModel();
    userLevels: UserLevelModel[] = [];
    customerModifyModalVisible: boolean = false;
    customerId: string;
    visiblePasswordForm = false;
    loadingPasswordForm = false;
    @ViewChild('customerGrid')
    customerGrid: CustomerGridComponent;
    @ViewChild('customerResetPassword')
    customerResetPassword: ResetPasswordComponent;
    type = 'customer';

    constructor(
        private readonly modalService: NzModalService,
        private readonly service: CustomerService,
        private readonly translateService: TranslateService,
        private readonly messageService: NzMessageService,
        private readonly userLevelService: UserLevelService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.userLevels = (
            await this.userLevelService.getUserLevels(
                new QueryModel({ limit: 1000 })
            )
        ).data;
    }

    toggleFilterVisible() {
        this.filterVisible = !this.filterVisible;
    }

    async search(query: CustomerQueryModel) {
        await this.customerGrid.triggerLoadData(query);
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
        const response = await this.service.deleteCustomer(id);
        if (response) {
            this.messageService.success(
                this.translateService.instant('customer.delete-complete')
            );
            await this.customerGrid.triggerLoadData();
        } else {
            this.messageService.error(
                this.translateService.instant('customer.delete-fail')
            );
        }
    }

    openModalCreate() {
        this.handleCustomerModifyModalVisible(true);
    }

    async resetPassword(userId: string) {
        this.customerId = userId;
        this.handleVisible(true);
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
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

    handleVisible(flag = true) {
        this.visiblePasswordForm = !!flag;
        if (!flag) {
            this.customerResetPassword.reset();
        }
    }

    handleCustomerModifyModalVisible(flag = true) {
        this.customerModifyModalVisible = flag;
    }

    afterCreateCustomer() {
        this.customerGrid.triggerLoadData();
    }

    handleLoading(flag = true) {
        this.loadingPasswordForm = !!flag;
    }
}