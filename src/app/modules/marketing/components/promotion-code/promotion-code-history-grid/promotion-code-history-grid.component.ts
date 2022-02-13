import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerQueryModel } from '@/modules/customer/models/customer-query.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { OrderQueryModel } from '@/modules/order/models/order-query.model';
import { OrderService } from '@/modules/order/services/order.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { PromotionCodeHistoryModel } from '@/modules/marketing/models/promotion-code-history.model';
import { PromotionCodeHistoryQuery } from '@/modules/marketing/models/promotion-code-history-query.model';
import { PromotionCodeHistoryService } from '@/modules/marketing/services/promotion-code-history.service';
import { PromotionPolicyModel } from '@/modules/marketing/models/promotion-policy';


@Component({
  selector: 'promotion-code-history-grid',
  templateUrl: './promotion-code-history-grid.component.html',
})

export class PromotionCodeHistoryGridComponent implements OnInit {
  loadingGrid: boolean = false;
  statisticData = [
    {
      key: 'totalCode',
      title: 'marketing.promotion-policy-promotionHistory.countOfCodes',
      value: 0
    },
    {
      key: 'totalQuantity',
      title: 'marketing.promotion-policy-promotionHistory.countOfUsedCodes',
      value: 0
    },
    {
      key: 'totalUser',
      title: 'marketing.promotion-policy-promotionHistory.countOfUsers',
      value: 0
    },
    {
      key: 'totalAmount',
      title: 'marketing.promotion-policy-promotionHistory.sumOfMoney',
      value: 0
    },
  ];
  accounts: { [_id: string]: Customer } = {};
  orderCodes: { [_id: string]: string } = {};
  orderIds: { [_id: string]: string } = {};
  promotionPolicies: { [_id: string]: PromotionPolicyModel } = {};
  queryModel = new PromotionCodeHistoryQuery({ page: 1, limit: 20, extraFields: 'namePolicy' });
  tableData: PagingModel<PromotionCodeHistoryModel> = new PagingModel<PromotionCodeHistoryModel>();
  constructor(
    private promotionCodeHistoryService: PromotionCodeHistoryService,
    private customerService: CustomerService,
    private orderSerivce: OrderService) {
  }

  async ngOnInit() {
    await this.loadData();
  }

  async triggerLoadData(query: PromotionCodeHistoryQuery = null) {
    this.promotionPolicies = {};
    if (query.policyId) {
      query.extraFields = 'namePolicy';
      const promotionCode = await this.promotionCodeHistoryService.filterPromotionCodeHistory(query);
      if (!_.isEmpty(promotionCode.data)) {
        const usedPromotionCodeIds = promotionCode.data.map(item => item._id).join(',');
        _.forEach(promotionCode.data, (item) => {
          if (item.promotionPolicy) {
            this.promotionPolicies[item._id] = item.promotionPolicy;
          }
        });
        if (usedPromotionCodeIds) {
          this.loadData(new PromotionCodeHistoryQuery({
            page: 1, limit: 20, promotionCodeId: usedPromotionCodeIds, startTime: query.startTime, endTime: query.endTime
          }));
        }
      } else {
        this.clearStatistic();
        this.tableData = new PagingModel<PromotionCodeHistoryModel>();
      }
    } else {
      this.loadData(new PromotionCodeHistoryQuery({
        page: 1, limit: 20, promotionCode: query.code, startTime: query.startTime, endTime: query.endTime, extraFields: 'namePolicy'
      }));
    }
  }

  async loadData(query: PromotionCodeHistoryQuery = null, page = null) {
    this.loadingGrid = true;

    if (query) {
      this.queryModel = query;
    }

    if (page) {
      this.queryModel.page = page;
    }

    this.queryModel.statistic = true;

    const data = await this.promotionCodeHistoryService.getPromotionCodeHistorys(this.queryModel);
    this.tableData = data['pagingModel'];
    if (!_.isEmpty(this.tableData.data)) {
      this.tableData.data.forEach(element => {
        if (element.promotionCodeId && element.promotionPolicy) {
          this.promotionPolicies[element.promotionCodeId] = element.promotionPolicy;
        }
      });

      const verifyQuery = this.promotionCodeHistoryService.verifyPageQueryModel(this.tableData, this.queryModel);
      if (verifyQuery.error) {
        this.queryModel = verifyQuery.modelQuery;
        this.tableData = await this.promotionCodeHistoryService.getPromotionCodeHistorys(this.queryModel);
      }

      this.processStatistics(data['statistics']);
      this.getAccounts(this.tableData);
      this.getOrders(this.tableData);
    } else {
      this.clearStatistic();
      this.tableData = new PagingModel<PromotionCodeHistoryModel>();
    }

    this.loadingGrid = false;
  }

  processStatistics(data) {
    this.statisticData.forEach(item => {
      item.value = data[item.key] ? data[item.key] : 0;
    });
  }

  async loadDataByPage($event) {
    await this.loadData(null, $event);
  }

  async loadDataByPageSize($event) {
    this.queryModel.limit = $event;
    await this.loadData();
  }

  clearStatistic() {
    this.statisticData.forEach(item => {
      item.value = 0;
    });
  }

  async getAccounts(data: PagingModel<PromotionCodeHistoryModel>) {
    this.accounts = {};
    const dataUserIds = data.data.filter(item => item.userId).map(item => item.userId).join(',');
    if (dataUserIds) {
      const userPaging = await this.customerService.getCustomers(new CustomerQueryModel({ limit: this.queryModel.limit, userIds: dataUserIds }));
      userPaging.data.forEach(account => {
        this.accounts[account._id] = account;
      });
    }
  }

  async getOrders(data: PagingModel<PromotionCodeHistoryModel>) {
    this.orderCodes = {};
    this.orderIds = {};
    const datatransCodes = data.data.filter(item => item.transCode).map(item => item.transCode).join(',');
    if (datatransCodes) {
      const orderPaging = await this.orderSerivce.getOrders(new OrderQueryModel({ limit: this.queryModel.limit, transCode: datatransCodes }));
      orderPaging.data.forEach(order => {
        if (order.transCode) {
          this.orderCodes[order.transCode] = order.code;
          this.orderIds[order.transCode] = order._id;
        }
      });
    }
  }
}
