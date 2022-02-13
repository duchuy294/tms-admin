import * as _ from 'lodash';
import { Component } from '@angular/core';
import { Customer } from 'app/modules/customer/models/customer-detail.model';
import { CustomerService } from 'app/modules/customer/services/customer.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OnInit } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RestrictedReachModel } from 'app/modules/order/models/restricted-reach.model';
import { RestrictedReachService } from './../../services/restricted-reach.service';
import { Servicer } from 'app/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'restricted-reach',
    templateUrl: './restricted-reach.component.html'
})
export class RestrictedReachComponent implements OnInit {
    public query = new QueryModel();
    public users: { [propName: string]: Customer } = {};
    public servicers: { [propName: string]: Servicer } = {};
    public pagingData = new PagingModel<RestrictedReachModel>();
    public visibleModal = false;
    public model = new RestrictedReachModel();
    public showFilter = false;

    constructor(
        public restrictedReachService: RestrictedReachService,
        public userService: CustomerService,
        public translateService: TranslateService,
        public servicerService: ServicerService,
        public modalService: NzModalService
    ) { }

    public async ngOnInit() {
        window.scrollTo(0, 0);
        await this.loadData();
    }

    public async loadData() {
        this.pagingData = await this.restrictedReachService.filter(this.query);

        const userIds = [];
        _.forEach(this.pagingData.data, reach => {
            _.forEach(reach.userIds, userId => {
                if (userId && !this.users[userId]) {
                    userIds.push(userId);
                }
            });
        });
        if (userIds.length > 0) {
            const userPaging = await this.userService.getCustomers(
                new QueryModel({ limit: 10000, userIds: userIds.join(',') })
            );
            _.forEach(userPaging.data, x => {
                this.users[x._id] = x;
            });
        }

        const servicerIds = [];
        _.forEach(this.pagingData.data, reach => {
            _.forEach(reach.servicerIds, servicerId => {
                if (servicerId && !this.servicers[servicerId]) {
                    servicerIds.push(servicerId);
                }
            });
        });
        if (servicerIds.length > 0) {
            const servicerPaging = await this.servicerService.getServicers(
                new QueryModel({
                    limit: 10000,
                    servicerIds: servicerIds.join(',')
                })
            );
            _.forEach(servicerPaging.data, x => {
                this.servicers[x._id] = x;
            });
        }
    }

    handleVisible(flag = true) {
        this.visibleModal = flag;
    }

    openModificationModal(model = null) {
        if (!model) {
            model = new RestrictedReachModel();
        }
        this.model = _.cloneDeep(model);
        this.handleVisible(true);
    }

    public delete(id: string) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant(
                'order.restricted-delete-title'
            ),
            nzContent: this.translateService.instant(
                'order.restricted-delete-content'
            ),
            nzOkText: this.translateService.instant('button.agree'),
            nzOkType: 'danger',
            nzOnOk: () => this.deleteItem(id),
            nzCancelText: this.translateService.instant('button.no'),
            nzOnCancel: null
        });
    }

    async deleteItem(id: string) {
        if (await this.restrictedReachService.delete(id)) {
            await this.loadData();
        }
    }

    public edit(item: RestrictedReachModel) {
        this.openModificationModal(item);
    }

    async search(query: QueryModel) {
        this.query = query;
        await this.loadData();
    }
}
