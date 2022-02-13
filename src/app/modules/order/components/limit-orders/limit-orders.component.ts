import * as _ from 'lodash';
import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OnInit } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { Servicer } from 'app/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'limit-orders',
    templateUrl: './limit-orders.component.html'
})
export class LimitOrdersComponent implements OnInit {
    public query = new QueryModel();
    public pagingData = new PagingModel<Servicer>();
    public visibleModal = false;
    public model = new Servicer();
    public showFilter = false;
    loading = false;
    public groups = {};

    constructor(
        public translateService: TranslateService,
        public servicerService: ServicerService,
        public modalService: NzModalService
    ) { }

    public async ngOnInit() {
        window.scrollTo(0, 0);
        await this.loadData();
        this.loading = true;
        const groups = (await this.servicerService.getGroupServicers()).data;
        _.forEach(groups, group => {
            this.groups[group._id] = group;
        });
        this.loading = false;
    }

    public async loadData() {
        this.loading = true;
        this.pagingData = await this.servicerService.getServicers(this.query);
        this.loading = false;
    }

    handleVisible(flag = true) {
        this.visibleModal = flag;
    }

    openModificationModal(model = null) {
        if (!model) {
            model = new Servicer();
        }
        this.model = _.cloneDeep(model);
        this.handleVisible(true);
    }

    public edit(item: Servicer) {
        this.openModificationModal(item);
    }

    async search(query: QueryModel) {
        this.query = query;
        await this.loadData();
    }
}
