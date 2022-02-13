import * as _ from 'lodash';
import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { PartnerProcesService } from '@/pages/statistic/services/partner-process.service';
import { PartnerProcessModel } from '@/pages/statistic/models/partner-process.model';
import { PartnerProcessQueryModel } from '@/pages/statistic/models/parner-process-query.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';

@Component({
    selector: 'partner-process-detail',
    templateUrl: './partner-process-detail.component.html',
    styleUrls: ['./partner-process-detail.component.less']
})
export class PartnerProcessDetailComponent implements OnInit {

    constructor(
        private partnerProcesService: PartnerProcesService,
        public servierService: ServicerService,
        public orderService: OrderService,
        private routeActive: ActivatedRoute,
    ) { }
    tableData: PartnerProcessModel = new PartnerProcessModel();
    orders = new PagingModel<OrderModel>();
    visibleModal: boolean = false;
    loading: boolean = false;
    tableModals = [];
    queryModel: PartnerProcessQueryModel = new PartnerProcessQueryModel();
    currentTime = null;
    totalOrder = 0;
    dateCurrent = moment().format('DD/MM/YYYY');
    async ngOnInit() {
        this.queryModel.servicerId = this.routeActive.snapshot.paramMap.get('servicerId');
        await this.getData(this.queryModel);
    }

    async getData(modelQuery: PartnerProcessQueryModel = null) {
        this.tableData = await this.partnerProcesService.workingsDetail(modelQuery);
    }

    async showDetail(orderCodes: string[], currentTime = 0) {
        this.tableModals = [];
        this.loading = true;
        this.currentTime = currentTime;
        this.totalOrder = 0;
        this.orders = await this.orderService.getOrders(new QueryModel({ limit: 1000, code: orderCodes, fields: '_id,detail,code,finishedAt' }));
        const dataPoint = [];
        if (this.orders.data) {
            _.orderBy(this.orders.data, ['finishedAt'], ['desc']).forEach(item => {
                if (item.detail.points) {
                    item.detail.points.forEach(p => {
                        if (p.type === 2) {
                            let soCode = item.code;
                            if (p.externalCode) {
                                soCode = p.externalCode.split('_')[0];
                            }
                            dataPoint.push({ total: item.detail.points.length - 1, point: p.location, externalCode: p.externalCode, orderId: item._id, code: item.code, soCode });
                        }
                    });
                }
            });
            if (dataPoint) {
                const groupsSo = _.groupBy(dataPoint, item => item.soCode);
                _.each(groupsSo, data => {
                    this.tableModals.push({
                        soCode: data[0].soCode,
                        code: data[0].code,
                        orderId: data[0].orderId,
                        point: data[0].point,
                        countPoint: data.length
                    });
                    this.totalOrder += data.length
                })
            }
        }
        this.visibleModal = true;
        this.loading = false;

    }

    async onSearch(modelQuery: PartnerProcessQueryModel = null) {
        this.tableData = await this.partnerProcesService.workingsDetail(modelQuery);
    }

    roundNumber(num) {
        if (Number.isInteger(num)) {
            return num;
        }
        return parseFloat(num).toFixed(1);
    }

    convertInt(num) {
        return parseInt(num);
    }
}
