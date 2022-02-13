import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { LoyaltyPoint } from 'app/modules/marketing/models/loyalty-point.model';
import { LoyaltyPointQueryModel } from 'app/modules/marketing/models/loyalty-point-query.model';
import { LoyaltyPointService } from '@/modules/marketing/services/loyalty-point.service';
import { mapKeys } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';

@Component({
    selector: 'loyalty-point-history-grid',
    templateUrl: './loyalty-point-history-grid.component.html'
})
export class LoyaltyPointHistoryGridComponent implements OnInit {
    @Output() detail: EventEmitter<QueryModel> = new EventEmitter<QueryModel>();
    loadingGrid: boolean = false;
    tableData = new PagingModel<LoyaltyPoint>();
    queryModel = new LoyaltyPointQueryModel();
    userList = {};
    adminList = {};

    constructor(
        private adminService: AdminService,
        private customerService: CustomerService,
        private loyaltyPointService: LoyaltyPointService,
        private servicerService: ServicerService,
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async triggerLoadData(queryModel: QueryModel, pageIndex = 1) {
        await this.loadData(queryModel, pageIndex);
    }

    async loadData(query = null, page = null) {
        if (query) {
            this.queryModel = new QueryModel(query);
        }
        if (page) {
            this.queryModel.page = page;
        }
        this.loadingGrid = true;

        this.tableData = await this.loyaltyPointService.get(this.queryModel);
        const verifyQuery = this.loyaltyPointService.verifyPageQueryModel(this.tableData, this.queryModel);
        if (verifyQuery.error) {
            this.queryModel = verifyQuery.modelQuery;
            this.tableData = await this.loyaltyPointService.get(this.queryModel);
        }

        const response = await this.getReceiverName(this.tableData.data);
        this.userList = mapKeys(response, '_id');

        this.loadingGrid = false;
    }

    async loadDataByPage($event = 1) {
        await this.loadData(null, $event);
    }

    async loadDataByPageSize($event = 20) {
        this.queryModel.limit = $event;
        await this.loadData(null, 1);
    }

    async getReceiverName(data) {
        let userIds = '', servicerIds = '', accountIds = '';
        let countUserId = 0, countServicerId = 0, countCreatedBy = 0;
        data.forEach((element) => {
            if (element.userType === 'user') {
                if (countUserId !== 0) {
                    userIds += ',';
                }
                userIds += element.userId;
                countUserId++;
            } else if (element.userType === 'servicer') {
                if (countServicerId !== 0) {
                    servicerIds += ',';
                }
                servicerIds += element.userId;
                countServicerId++;
            }

            if (element.createdBy && element.createdBy !== undefined) {
                if (countCreatedBy !== 0) {
                    accountIds += ',';
                }
                accountIds += element.createdBy;
                countCreatedBy++;
            }
        });
        let result = [];
        let responseCustomer, responseServicer, responseAdmin;
        if (userIds !== '') {
            responseCustomer = await this.customerService.getCustomers(new QueryModel({ limit: 5000, userIds, fields: '_id,fullName,code' }));
            result = [...result, ...responseCustomer.data];
        }
        if (servicerIds !== '') {
            responseServicer = await this.servicerService.getServicers(new QueryModel({ limit: 5000, servicerIds, fields: '_id,fullName,code' }));
            result = [...result, ...responseServicer.data];
        }
        if (accountIds !== '') {
            responseAdmin = await this.adminService.getAdmins(new QueryModel({ limit: 5000, accountIds, fields: '_id,fullName' }));
            this.adminList = mapKeys(responseAdmin.data, '_id');
        }
        return result;
    }

    onClickShowDetail(data) {
        data = {
            ...data,
            receiverName: this.userList[data.userId].fullName,
            receiverCode: this.userList[data.userId].code,
            staffName: this.adminList[data.createdBy] ? this.adminList[data.createdBy] : null,
        };
        this.detail.emit(data);
    }
}
