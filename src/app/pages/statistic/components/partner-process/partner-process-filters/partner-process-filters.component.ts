import * as _ from 'lodash';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { PartnerProcessQueryModel } from '@/pages/statistic/models/parner-process-query.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'partner-process-filters',
    templateUrl: './partner-process-filters.component.html',
    styleUrls: ['./partner-process-filters.component.less']
})
export class PartnerProcessFiltersComponent implements OnInit {

    @Output() onSearch = new EventEmitter<PartnerProcessQueryModel>();
    @Output() onExport = new EventEmitter<PartnerProcessQueryModel>();
    groups: any[];
    timesData = [...Array(24).keys()].map(x => x + 1);
    servicerSearchCondition = {
        fields: 'fullName,phone,code',
        status: `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED},${Status.DELETED}`
    };
    queryModel: PartnerProcessQueryModel = new PartnerProcessQueryModel();
    _selectedServicer: any[] = [];

    constructor(public servierService: ServicerService) { }

    async ngOnInit() {
        const result = await this.servierService.getGroupServicers(new QueryModel({ limit: 1000 }));
        this.groups = result.data;
    }

    set selectedServicer(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedServicer = value;
            this.queryModel.servicerId = value.join(',');
        }
    }

    get selectedServicer() {
        return this._selectedServicer;
    }

    search() {
        this.onSearch.emit(this.queryModel);
    }

    export() {
        this.onExport.emit(this.queryModel);
    }
    reset() {
        this.queryModel.servicerId = null;
        this.queryModel.successRatioFrom = null;
        this.queryModel.successRatioTo = null;
        this.onSearch.emit(this.queryModel);
    }
}
