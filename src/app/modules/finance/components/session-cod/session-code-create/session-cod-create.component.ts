import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderService } from '@/modules/order/services/order.service';
import { QueryModel } from '@/models/query.model';
import { Router } from '@angular/router';
import { SessionCodModel } from '@/modules/finance/models/session-code-create.model';
import { SessionCodService } from '@/modules/finance/services/session-cod.service';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'session-cod-create',
    templateUrl: './session-cod-create.component.html',
    styleUrls: ['session-cod-create.component.less']
})
export class SessionCodCreateComponent implements OnInit {

    constructor(
        private orderService: OrderService,
        private customerService: CustomerService,
        private sessionCodService: SessionCodService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private router: Router,
    ) { }

    searchTime: Date = new Date();
    list: TransferItem[] = [];
    loading = false;
    disabledCreate = true;
    orderQueryModel: QueryModel = new QueryModel({
        limit: 100000,
        finishedEnd: moment(this.searchTime).endOf('day').valueOf(),
        codSession: 'none',
        hasCollection: 1,
        submitted: 'full',
        fields: 'userId,userEnterpriseId'
    });

    model = new SessionCodModel();

    ngOnInit(): void {
        this.onGetCustomers();
    }

    async onGetCustomers() {
        this.loading = true;
        this.list = [];
        const response = await this.orderService.getOrders(this.orderQueryModel);
        if (response && response.data && response.data.length > 0) {
            const userIds = response.data.map(order => order.userEnterpriseId || order.userId);
            const uniqUserId = _.uniq(userIds);
            const customers = await this.customerService.postCustomers(new QueryModel({
                limit: 10000,
                userIds: uniqUserId.join(','),
                fields: 'fullName,code,phone,code'
            }));
            if (customers && customers.data) {
                this.list = customers.data.map(customer => {
                    return {
                        key: customer._id,
                        title: `${customer.fullName} - ${customer.phone} - ${customer.code}`,
                        description: `${customer.fullName.toLocaleLowerCase()} - ${customer.phone} - ${customer.code.toLocaleLowerCase()}`,
                    };
                });
            }
        }
        this.loading = false;
        return [];
    }

    disabledDate(current: Date) {
        const today = moment();
        const dateCurrent = moment(current);
        return today.diff(dateCurrent) < 0;
    }

    async onChangeTime(result: Date) {
        if (result) {
            const dateCurrent = moment(result).endOf('day').valueOf();
            this.orderQueryModel.finishedEnd = dateCurrent;
            await this.onGetCustomers();
        }
    }

    filterOption(inputValue: string, item: any) {
        return item.title.indexOf(inputValue) > -1 || item.description.indexOf(inputValue) > -1;
    }

    onChangeList() {
        this.disabledCreate = _.filter(this.list, customer => customer.direction === 'right').length === 0;
    }

    async createSessionCod() {
        const selectedCustomers = _.filter(this.list, customer => customer.direction === 'right').map(user => user.key);
        if (selectedCustomers) {
            this.model.userIds = selectedCustomers;
            this.model.time = moment(this.searchTime).endOf('day').valueOf();
            const response = await this.sessionCodService.create(this.model);
            if (response.errorCode === 0) {
                this.disabledCreate = true;
                this.messageService.success(`${this.translateService.instant(`finance.session-cod.create`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
                this.router.navigate(['/pages/finance/session-cod']);
            } else {
                this.messageService.error(response.message);
            }
        }

    }
}
