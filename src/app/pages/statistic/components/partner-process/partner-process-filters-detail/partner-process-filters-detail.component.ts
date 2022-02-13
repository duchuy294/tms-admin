import * as _ from 'lodash';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PartnerProcessQueryModel } from '@/pages/statistic/models/parner-process-query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'partner-process-filters-detail',
    templateUrl: './partner-process-filters-detail.component.html',
    styleUrls: ['./partner-process-filters-detail.component.less']
})
export class PartnerProcessFiltersDetailComponent implements OnInit {
    _time = null;
    _form: number;
    _to: number;
    timesData = [...Array(24).keys()].map(x => x + 1);
    servicerSearchCondition = {
        fields: 'fullName,phone,code',
        status: `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED},${Status.DELETED}`
    };
    @Output() onSearch = new EventEmitter<PartnerProcessQueryModel>();
    queryModel: PartnerProcessQueryModel = new PartnerProcessQueryModel();
    _selectedServicer: any[] = [];

    constructor(public servierService: ServicerService, private routeActive: ActivatedRoute,) { }

    ngOnInit(): void {
        this._selectedServicer = [this.routeActive.snapshot.paramMap.get('servicerId')];
        this.queryModel.servicerId = this._selectedServicer.join(',')
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
        if (!this.queryModel.servicerId) {
            this.queryModel.servicerId = this.routeActive.snapshot.paramMap.get('servicerId');
        }
        this.onSearch.emit(this.queryModel);
    }

    reset() {
        this.queryModel.duration = null;
        this.queryModel.servicerId = null;
        this.onSearch.emit(this.queryModel);
    }

}
