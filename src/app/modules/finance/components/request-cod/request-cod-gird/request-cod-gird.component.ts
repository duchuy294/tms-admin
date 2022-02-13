import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { RequestCodListModel } from '@/modules/finance/models/request-cod-list.model';
import { RequestCodService } from '@/modules/finance/services/request-cod.service';
import { RequestCod, RequestCodEnum } from '@/constants/RequestCod';
import { ReportService } from '@/modules/report/services/report.service';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { OrderAction } from '@/modules/order/models/order-action.model';
import { Router } from '@angular/router';
import { AdminService } from '@/modules/admin/services/admin.service';
@Component({
    selector: 'request-cod-gird',
    templateUrl: './request-cod-gird.component.html',
})
export class RequestCodGridComponent implements OnInit {
    public tableData = new PagingModel<RequestCodListModel>();
    servicerGroups = {};
    performerGroup = {};
    @Input() queryModel: QueryModel = new QueryModel({ status: null });
    loadingGrid: boolean = false;
    requestCod = RequestCod;
    visibleModalConfirm: boolean = false;
    visibleModalReject: boolean = false;
    detail: RequestCodListModel = new RequestCodListModel();
    public actions = [
        new OrderAction({
            name: 'common.detail',
            perform: this.goToDetail.bind(this)
        }),
        new OrderAction({
            name: 'button.confirm',
            visible: (item: RequestCodListModel) => {
                return this.checkVisibleAction(item);
            },
            perform: this.goConfirm.bind(this)
        }),
        new OrderAction({
            name: 'actions.reject',
            visible: (item: RequestCodListModel) => {
                return this.checkVisibleAction(item);
            },
            perform: this.goReject.bind(this)
        }),
        new OrderAction({
            name: 'actions.enterCodeTransaction',
            visible: (item: RequestCodListModel) => {
                return this.checkVisibleEnterCodeTransaction(item);
            },
            perform: this.goConfirm.bind(this)
        }),
    ];
    
    constructor(
        private requestCodService: RequestCodService,
        private reportService: ReportService,
        private serviceService: ServicerService,
        private adminService: AdminService,
        private router: Router
    ) { }

    async _loadMetaData() {
        const servicerIds = [];
        const performerIds = [];

        _.forEach(this.tableData.data, (item) => {
            servicerIds.push(item.servicerId);
            performerIds.push(item.performerId);
        });
        if (_.uniq(servicerIds).length > 0) {
            this.servicerGroups = _.groupBy((await this.serviceService.getServicers(new QueryModel({ limit: 1000, servicerIds: _.uniq(servicerIds).join(',') }))).data, x => x._id);
        }
        if (_.uniq(performerIds).length > 0) {
            this.performerGroup = _.groupBy((await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds: _.uniq(performerIds).join(',') }))).data, x => x._id);
        }
    }

    async ngOnInit() {
        await this.loadData();
    }

    async triggerLoadData(queryModel: QueryModel, pageIndex?) {
        await this.loadData(queryModel, pageIndex);
    }

    async exPortData() {
        await this.reportService.exportRequest(this.queryModel);
    }

    checkVisibleAction(item: RequestCodListModel) {
        return item && (RequestCodEnum.request === item.status || RequestCodEnum.processing === item.status); 
    }
    
    checkVisibleEnterCodeTransaction(item: RequestCodListModel) {
        return RequestCodEnum.holding === item.status;
    }
    
    checkUpdate(item: RequestCodListModel) {
        return this.checkVisibleAction(item) || this.checkVisibleEnterCodeTransaction(item);
    }

    handelVisibleModalConfirm(flag = true) {
        this.visibleModalConfirm = !!flag;
    }

    handelVisibleModalReject(flag= true) {
        this.visibleModalReject = !!flag;
    }

    async loadData(query: QueryModel = null, page = 1) {
        if (query) {
            this.queryModel = new QueryModel(query);
        }
        if (page) {
            this.queryModel.page = page;
        }
        this.loadingGrid = true;
        this.tableData = await this.requestCodService.filter(this.queryModel);
        await this._loadMetaData();
        this.loadingGrid = false;
    }

    async loadDataByPage($event = 1) {
        await this.loadData(null, $event);
    }

    async loadDataByPageSize($event = 20) {
        this.queryModel.limit = $event;
        await this.loadData(null, 1);
    }

    async goToDetail(item: RequestCodListModel) {
        this.router.navigate(['/pages/finance/request-cod/' + item._id]);
    }

    async goConfirm(item: RequestCodListModel) {
        this.detail = _.cloneDeep(item);
        if (!this.detail.confirmedPaid) {
           this.detail.confirmedPaid = _.cloneDeep(this.detail.paid);
        }
        this.handelVisibleModalConfirm();
    }

    async goReject(item: RequestCodListModel) {
        this.detail = _.cloneDeep(item);
        this.handelVisibleModalReject(true);
    }

}
