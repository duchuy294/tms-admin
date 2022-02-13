import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderStatisticService } from '@/modules/order/services/order-statistic.service';
import { OrderType } from '@/modules/order/constants/OrderType';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseOrderHistoryGridComponent } from './warehouse-order-history-grid/warehouse-order-history-grid.component';

@Component({
    selector: 'warehouse-order-information',
    templateUrl: './warehouse-order-information.component.html',
    styleUrls: ['./warehouse-order-information.component.less']
})
export class WarehouseOrderInformationComponent implements OnInit {
    @ViewChild('grid') grid: WarehouseOrderHistoryGridComponent;
    id = this.route.snapshot.paramMap.get('id');
    modelQuery = new QueryModel({ warehouseId: this.id, serviceType: OrderType.SHARING_WAREHOUSE });
    filterVisible = false;
    statisticData = [];

    constructor(
        private route: ActivatedRoute,
        private orderStatisticService: OrderStatisticService,
        private translateSerivce: TranslateService
    ) { }

    async ngOnInit() {
        await this.getStatistic();
    }

    async getStatistic() {
        const statisticModelQuery = _.cloneDeep(this.modelQuery);
        const statisticData = await this.orderStatisticService.filter(_.assignIn(statisticModelQuery, { fields: 'totalOrder,totalsuccessfulOrder,totalIncome,totalCommission' }));
        this.statisticData = [
            {
                title: this.translateSerivce.instant('statistics.order-store.total-order'),
                value: statisticData.totalOrder
            },
            {
                title: this.translateSerivce.instant('statistics.order-store.total-successful-order'),
                value: statisticData.totalSuccessfulOrder
            },
            {
                title: this.translateSerivce.instant('statistics.order-store.total-income'),
                value: statisticData.totalIncome
            },
            {
                title: this.translateSerivce.instant('statistics.order-store.total-commission-fee'),
                value: statisticData.totalCommission
            }
        ];
    }

    async search(event = new QueryModel()) {
        this.modelQuery = event;
        await this.getStatistic();
        await this.grid.loadData(this.modelQuery);
    }

    toggleFilter() {
        this.filterVisible = !this.filterVisible;
    }
}