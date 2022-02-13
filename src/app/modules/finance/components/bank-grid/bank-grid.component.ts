import * as _ from 'lodash';
import { BankModel } from './../../models/bank.model';
import { BankService } from './../../services/bank.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateBankComponent } from './../modals/create-bank/create-bank.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Status } from 'app/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'bank-grid',
    templateUrl: './bank-grid.component.html'
})
export class BankGridComponent implements OnInit {
    @ViewChild('createBank') createBank: CreateBankComponent;
    modelQuery = new QueryModel();
    model = new BankModel();
    loading: boolean = false;
    pageSize: number = 15;
    pageIndex: number = 1;
    visibleModel: boolean = false;
    searchKey: string = '';
    loadingModel: boolean = false;
    private onLoad = _.debounce(() => {
        this.loadData();
    }, 500);

    public tableData = new PagingModel<BankModel>();

    constructor(
        private bankService: BankService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private modalService: NzModalService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.modelQuery.limit = this.pageSize;
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED}`;
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.bankService.filter(this.modelQuery);
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

    delete(bankId: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteConfirm(bankId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteConfirm(bankId: string = null) {
        const response = await this.bankService.delete(bankId);
        if (response) {
            this.messageService.success(
                this.translateService.instant(
                    'finance.bank.status-delete-complete'
                )
            );
            await this.loadData();
        } else {
            this.messageService.error(
                this.translateService.instant('finance.bank-status.delete-fail')
            );
        }
    }

    async edit(bankId: string = null) {
        this.model = await this.bankService.get(bankId);
        this.handleVisible(true);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createBank.reset();
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
                        ? 'finance.bank.status-create-complete'
                        : 'finance.bank.status-edit-complete'
                )
            );
            await this.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    async onFind(event) {
        this.modelQuery.name = event;
        this.pageIndex = 1;
        this.modelQuery.page = 1;
        this.onLoad();
    }
}
