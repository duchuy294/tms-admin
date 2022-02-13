import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { UserLevelModel } from '@/modules/user/models/user-level.model';

@Component({
    selector: 'customer-grid',
    templateUrl: './customer-grid.component.html'
})
export class CustomerGridComponent implements OnInit {
    queryModel: QueryModel = new QueryModel({ status: null });
    loadingGrid: boolean = false;
    public tableData = new PagingModel<Customer>();
    userLevelDictionary: { [_id: string]: UserLevelModel } = {};
    statisticData = { totalUser: 0, totalEnterprise: 0, totalOrder: 0 };
    @Input() set userLevels(values: UserLevelModel[]) {
        values.forEach(value => (this.userLevelDictionary[value._id] = value));
    }
    @Output() delete = new EventEmitter();
    @Output() password = new EventEmitter();

    async ngOnInit() {
        await this.loadData();
    }

    constructor(private readonly customerService: CustomerService) { }

    async triggerLoadData(queryModel: QueryModel = null, pageIndex = 1) {
        if (queryModel) {
            this.queryModel = queryModel;
        }
        await this.loadData(pageIndex);
    }

    async loadData(pageIndex = 1) {
        if (pageIndex) {
            this.queryModel.page = pageIndex;
        }
        this.loadingGrid = true;
        if (!this.queryModel.hasOwnProperty('statistic')) {
            this.queryModel.statistic = 'true';
        }
        const data = await this.customerService.getCustomersAndStaistic(
            this.queryModel
        );
        this.tableData = data.pagingModel;

        if (data.statistic) {
            this.statisticData.totalUser = data.statistic.totalUser;
            this.statisticData.totalEnterprise = data.statistic.totalEnterprise;
            this.statisticData.totalOrder = data.statistic.totalOrder;
        }

        this.loadingGrid = false;
    }

    async loadDataByPage($event = 1) {
        this.queryModel.page = $event;
        await this.loadData(this.queryModel.page || 1);
    }

    async loadDataByPageSize($event = 20) {
        this.queryModel.limit = $event;
        this.queryModel.page = 1;
        await this.loadData();
    }

    handleDelete(customerId: string = null) {
        this.delete.emit(customerId);
    }

    handlePassword(customerId: string = null) {
        this.password.emit(customerId);
    }
}