import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagingModel } from './../../../utility/components/paging/paging.model';
import { QueryModel } from './../../../../models/query.model';
import { Servicer } from '../../models/servicer/servicer.model';
import { ServicerService } from '../../services/servicer.service';
import { ServicerType } from './../../../../constants/ServicerType';

@Component({
    selector: 'servicer-grid',
    templateUrl: 'servicer-grid.component.html'
})
export class ServicerGridComponent implements OnInit {
    queryModel = new QueryModel({ status: null });
    loadingGrid: boolean = false;
    @Input() model = new PagingModel<Servicer>();
    @Output() update = new EventEmitter<void>();
    @Input() hasActions = false;
    @Input() flagReachModal: boolean = false;
    @Input() servicerId: string = '';
    @Output() password = new EventEmitter<string>();
    @Output() delete = new EventEmitter<string>();
    openTeam = {};
    groups = {};

    constructor(
        private service: ServicerService
    ) { }

    async ngOnInit() {
        if (!this.flagReachModal) {
            if (this.servicerId) {
                this.queryModel.enterpriseId = this.servicerId;
                this.queryModel.type = ServicerType.EnterpriseStaff;
            }
            await this.loadData();
        } else {
            this.queryModel.limit = 1000;
        }
        const groups = (await this.service.getGroupServicers()).data;
        _.forEach(groups, group => {
            this.groups[group._id] = group;
        });
    }

    handlePassword(servicerId) {
        this.password.emit(servicerId);
    }

    async loadData(pageIndex: number = null) {
        if (pageIndex) {
            this.queryModel.page = pageIndex;
        }
        this.loadingGrid = true;
        const servicers = await this.service.getServicers(this.queryModel);
        this.model = servicers;
        this.loadingGrid = false;
    }

    async triggerLoadData(queryModel: QueryModel = null, pageIndex = 1) {
        if (queryModel) {
            this.queryModel = queryModel;
        }
        await this.loadData(pageIndex);
    }

    async loadDataByPage($event: number = 1) {
        this.queryModel.page = $event;
        await this.loadData();
    }

    async loadDataByPageSize($event: number = 1) {
        this.queryModel.limit = $event;
        this.queryModel.page = 1;
        await this.loadData();
    }

    handleDelete(customerId) {
        this.delete.emit(customerId);
    }
}