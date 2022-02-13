import * as _ from 'lodash';
import * as ns from 'moment';
import { Component } from '@angular/core';
import { Customer } from 'app/modules/customer/models/customer-detail.model';
import { CustomerService } from 'app/modules/customer/services/customer.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OnInit } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RestrictedTimeoutModel } from '../../models/restricted-timeout.model';
import { RestrictedTimeoutService } from '../../services/restricted-timeout.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'restricted-timeout',
    templateUrl: './restricted-timeout.component.html'
})
export class RestrictedTimeoutComponent implements OnInit {
    public query = new QueryModel();
    public users: { [propName: string]: Customer } = {};
    public pagingData = new PagingModel<RestrictedTimeoutModel>();
    public visibleModal = false;
    public model = new RestrictedTimeoutModel();
    public showFilter = false;

    constructor(
        public restrictedTimeoutService: RestrictedTimeoutService,
        public userService: CustomerService,
        public translateService: TranslateService,
        public modalService: NzModalService
    ) { }

    public async ngOnInit() {
        window.scrollTo(0, 0);
        await this.loadData();
    }

    public async loadData() {
        this.pagingData = await this.restrictedTimeoutService.filter(this.query);
        const userIds = [];
        _.forEach(this.pagingData.data, reach => {
            if (reach.userId && !this.users[reach.userId]) {
                userIds.push(reach.userId);
            }
        });
        if (userIds.length > 0) {
            const userPaging = await this.userService.getCustomers(
                new QueryModel({ limit: 10000, userIds: userIds.join(',') })
            );
            _.forEach(userPaging.data, x => {
                this.users[x._id] = x;
            });
        }
    }

    handleVisible(flag = true) {
        this.visibleModal = flag;
    }

    openModificationModal(model = null) {
        if (!model) {
            model = new RestrictedTimeoutModel();
        }
        this.model = _.cloneDeep(model);
        this.handleVisible(true);
    }

    public delete(id: string) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant(
                'order.restricted-timeout.delete-title'
            ),
            nzContent: this.translateService.instant(
                'order.restricted-timeout.delete-content'
            ),
            nzOkText: this.translateService.instant('button.agree'),
            nzOkType: 'danger',
            nzOnOk: () => this.deleteItem(id),
            nzCancelText: this.translateService.instant('button.no'),
            nzOnCancel: null
        });
    }

    async deleteItem(id: string) {
        if (await this.restrictedTimeoutService.delete(id)) {
            await this.loadData();
        }
    }

    public edit(item: RestrictedTimeoutModel) {
        this.openModificationModal(item);
    }

    async search(query: QueryModel) {
        this.query = query;
        await this.loadData();
    }

    public getDuration(duration: number): string {
        return ns.utc(ns.duration(duration, 'seconds').as('milliseconds')).format('HH:mm:ss');
    }
}
