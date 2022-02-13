import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { DebtCod } from '@/modules/finance/models/request-cod-list.model';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { WalletModel } from '@/modules/finance/models/wallet.model';
import { WalletService } from '@/modules/finance/services/wallet.service';
@Component({
    selector: 'request-debt-gird',
    templateUrl: './request-debt-gird.component.html',
})
export class RequestDebtGridComponent implements OnInit {
    public tableData = new PagingModel<WalletModel>();
    servicerGroups = {};
    performerGroup = {};
    @Input() queryModel: QueryModel;
    loadingGrid: boolean = false;
    visibleModalConfirm: boolean = false;
    detail: DebtCod = new DebtCod();
    total: any;
    constructor(
        private walletService: WalletService,
        private serviceService: ServicerService,
    ) { }

    async _loadMetaData() {
        const servicerIds = [];

        _.forEach(this.tableData.data, (item) => {
            servicerIds.push(item.userId);
        });
        if (_.uniq(servicerIds).length > 0) {
            this.servicerGroups = _.groupBy((await this.serviceService.getServicers(new QueryModel({ limit: 1000, servicerIds: _.uniq(servicerIds).join(',') }))).data, x => x._id);
        }
    }

    async ngOnInit() {
        await this.loadData(this.queryModel);
    }

    async triggerLoadData(queryModel: QueryModel, pageIndex?) {
        await this.loadData(queryModel, pageIndex);
    }

    handelVisibleModalConfirm(flag = true) {
        this.visibleModalConfirm = !!flag;
    }

    async loadData(query: QueryModel = null, page = 1) {
        if (query) {
            this.queryModel = new QueryModel(query);
        }
        if (page) {
            this.queryModel.page = page;
        }
        this.loadingGrid = true;
        this.tableData = await this.walletService.filter(this.queryModel);
        this.total = await this.walletService.getStatistics(this.queryModel);
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

    async goConfirm(item: WalletModel) {
        this.detail.amount = item.confirmedCOD;
        this.detail.servicerId = item.userId;
        this.detail.type = 'bank';
        this.handelVisibleModalConfirm();
    }

    checkVisibleAction(item: WalletModel) {
        return item.confirmedCOD !== 0;
    }
}
