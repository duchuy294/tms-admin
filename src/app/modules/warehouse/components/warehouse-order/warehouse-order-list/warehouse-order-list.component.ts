import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderStatisticModel } from '@/modules/order/models/order-statistic.model';
import { OrderStatisticService } from '@/modules/order/services/order-statistic.service';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderStatusFilterComponent } from './../../../../utility/components/order-status-filter/order-status-filter.component';
import { OrderType } from '@/modules/order/constants/OrderType';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseOrderGridComponent } from './../warehouse-order-grid/warehouse-order-grid.component';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

@Component({
    selector: 'warehouse-order-list',
    templateUrl: './warehouse-order-list.component.html'
})
export class WarehouseOrderListComponent implements OnInit {
    @ViewChild('grid') grid: WarehouseOrderGridComponent;
    @ViewChild('status') status: OrderStatusFilterComponent;

    modelQuery = new QueryModel({ serviceType: OrderType.SHARING_WAREHOUSE });
    filterVisible: boolean = false;
    statisticData: OrderStatisticModel = null;
    statuses = [
        {
            name: 'all',
            value: 0,
            query: new QueryModel({}),
            label: this.translateService.instant('order.statusCode.all')
        },
        {
            name: OrderStatus.WatingToConfirm,
            value: 0,
            query: new QueryModel({ status: OrderStatus.WatingToConfirm }),
            label: this.translateService.instant(
                `order.statusCode.${OrderStatus.WatingToConfirm}`
            )
        },
        {
            name: OrderStatus.Accepted,
            value: 0,
            query: new QueryModel({ status: OrderStatus.Accepted }),
            label: this.translateService.instant(
                `order.statusCode.${OrderStatus.Accepted}`
            )
        },
        {
            name: OrderStatus.ConfirmCompleted,
            value: 0,
            query: new QueryModel({ status: OrderStatus.ConfirmCompleted }),
            label: this.translateService.instant(
                `order.statusCode.${OrderStatus.ConfirmCompleted}`
            )
        },
        {
            name: OrderStatus.Finished,
            value: 0,
            query: new QueryModel({ status: OrderStatus.Finished }),
            label: this.translateService.instant(
                `order.statusCode.${OrderStatus.Finished}`
            )
        },
        {
            name: 'cancelled',
            value: 0,
            query: new QueryModel({
                status: `${OrderStatus.CanceledByAdmin},${OrderStatus.CanceledByRenter},${OrderStatus.CanceledByLessor}`
            }),
            label: this.translateService.instant('order.statusCode.cancelled')
        }
    ];

    constructor(
        private orderStatisticService: OrderStatisticService,
        private warehouseService: WarehouseService,
        private translateService: TranslateService
    ) { }

    async ngOnInit() {
        await this.getStatisticOrderStatus();
        await this.getStatistic();
    }

    toggleFilter() {
        this.filterVisible = !this.filterVisible;
    }

    async search(event = new QueryModel()) {
        this.status.reset();
        this.modelQuery = event;
        await this.getStatistic();
        await this.grid.loadData(this.modelQuery);
    }

    async selectStatus() {
        this.modelQuery.serviceType = OrderType.SHARING_WAREHOUSE;
        await this.grid.loadData(this.modelQuery);
        await this.getStatistic();
    }

    async getStatistic() {
        this.statisticData = await this.orderStatisticService.filter(
            _.assignIn(this.modelQuery, {
                fields:
                    'totalOrder,totalSuccessfulOrder,totalCost,totalCommission'
            })
        );
    }

    async getStatisticOrderStatus() {
        const statistic = await this.orderStatisticService.filterOnStatus(
            new QueryModel({ serviceType: OrderType.SHARING_WAREHOUSE })
        );
        _.forEach(this.statuses, item => {
            item.value = statistic[item.name] || 0;
        });
    }

    async processOrder(id: string) {
        await this.warehouseService.processOrder(id, { action: 'process' });
        await this.grid.loadData(this.modelQuery);
        await this.getStatistic();
        await this.getStatisticOrderStatus();
    }
}
