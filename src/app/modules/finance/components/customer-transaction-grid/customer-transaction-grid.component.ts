import * as _ from 'lodash';
import { AccountModel } from '../../../admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { BalanceService } from '@/modules/finance/services/balance.service';
import { Component, Input, OnInit } from '@angular/core';
import { Customer } from 'app/modules/customer/models/customer-detail.model';
import { CustomerService } from '../../../customer/services/customer.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { TransactionModel } from '@/modules/finance/models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
    selector: 'customer-transaction-grid',
    templateUrl: './customer-transaction-grid.component.html',
    styleUrls: ['customer-transaction-grid.component.less']
})

export class CustomerTransactionGridComponent implements OnInit {
    loading: boolean = false;
    modelQuery = new QueryModel();
    performers: { [_id: string]: AccountModel } = {};
    _customerQuery = new QueryModel();
    customers: { [_id: string]: Customer } = {};

    public tableData = new PagingModel<TransactionModel>();

    @Input()
    set model(value) {
        this.modelQuery = value;
    }

    @Input()
    set userIds(value) {
        const userIds = _.join(value, ',');
        this.modelQuery.userIds = userIds;
    }

    constructor(
        private balanceService: BalanceService,
        private adminService: AdminService,
        private customerService: CustomerService,
        private transactionService: TransactionService
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.transactionService.filter(this.modelQuery);

        const verifyQuery = this.balanceService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.transactionService.filter(this.modelQuery);
        }

        const performedBy = await this.getAdmins(this.tableData);
        _.forEach(performedBy, performer => {
            this.performers[performer._id] = performer;
        });

        const customerData = await this.getCustomers(this.tableData);
        _.forEach(customerData, customer => {
            this.customers[customer._id] = customer;
        });

        this.loading = false;
    }

    async loadDataByPage(event: number = 1) {
        this.modelQuery.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event: number = 20) {
        this.modelQuery.limit = event;
        await this.loadData();
    }

    async getAdmins(data: PagingModel<TransactionModel>) {
        const accountIds = _.map(data.data, model => model.performerId).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: this.modelQuery.limit, accountIds }));
        return adminPaging.data;
    }

    async getCustomers(data: PagingModel<TransactionModel>) {
        const userIds = _.map(data.data, model => model.userId).join(',');
        const customerPaging = await this.customerService.getCustomers(new QueryModel({ limit: this.modelQuery.limit, userIds }));
        return customerPaging.data;
    }
}