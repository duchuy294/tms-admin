import * as _ from 'lodash';
import { BankModel } from '../../models/bank.model';
import { BankService } from '../../services/bank.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateSystemBankAccountComponent } from './../modals/create-system-bank-account/create-system-bank-account.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Status } from 'app/constants/status.enum';
import { SystemBankAccountModel } from '../../models/system-bank-account.model';
import { SystemBankAccountService } from '../../services/system-bank-account.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'system-bank-account-grid',
    templateUrl: './system-bank-account-grid.component.html'
})
export class SystemBankAccountGridComponent implements OnInit {
    @ViewChild('createSystemBankAccount')
    createSystemBankAccount: CreateSystemBankAccountComponent;
    modelQuery = new QueryModel();
    model = new SystemBankAccountModel();
    loading: boolean = false;
    pageSize: number = 15;
    pageIndex: number = 1;
    visibleModel: boolean = false;
    loadingModel: boolean = false;
    banks: { [id: string]: BankModel } = {};

    public tableData = new PagingModel<SystemBankAccountModel>();

    constructor(
        private systemBankAccountService: SystemBankAccountService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private modalService: NzModalService,
        private bankService: BankService
    ) { }

    async ngOnInit() {
        this.modelQuery.limit = this.pageSize;
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED}`;
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.systemBankAccountService.filter(
            this.modelQuery
        );
        const bankIds = _.map(
            this.tableData.data,
            account => account.bank
        ).join(',');
        const bankPaging = await this.bankService.filter(
            new QueryModel({ bankIds })
        );
        _.forEach(bankPaging.data, bank => {
            this.banks[bank._id] = bank;
        });
        this.loading = false;
    }

    async loadDataByPage($event = 1) {
        this.modelQuery.page = $event;
        await this.loadData();
    }

    async loadDataByPageSize($event = 20) {
        this.modelQuery.limit = $event;
        await this.loadData();
    }

    delete(systemBankAccountId: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteConfirm(systemBankAccountId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteConfirm(systemBankAccountId: string = null) {
        const response = await this.systemBankAccountService.delete(
            systemBankAccountId
        );
        if (response) {
            this.messageService.success(
                this.translateService.instant(
                    'finance.systemBankAccount.status-delete-complete'
                )
            );
            await this.loadData();
        } else {
            this.messageService.error(
                this.translateService.instant(
                    'finance.systemBankAccount.status-delete-fail'
                )
            );
        }
    }

    async edit(systemBankAccountId) {
        this.model = await this.systemBankAccountService.get(
            systemBankAccountId
        );
        this.handleVisible(true);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createSystemBankAccount.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingModel = !!flag;
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    $event.type === 'create'
                        ? 'finance.systemBankAccount.status-create-complete'
                        : 'finance.systemBankAccount.status-edit-complete'
                )
            );
            await this.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }
}
