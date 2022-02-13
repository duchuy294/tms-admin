import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { Selection } from '../../../../../modules/utility/models/filter.model';
import { ServicerService } from '../../../../../modules/servicer/services/servicer.service';
import {
    Component,
    EventEmitter,
    Output,
    ViewChild,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'filter-limit-orders',
    templateUrl: 'filter-limit-orders.component.html'
})
export class FilterLimitOrdersComponent implements OnInit {
    @ViewChild('filterLimitOrdersForm') filterLimitOrdersForm: NgForm;
    @Output() onSearch = new EventEmitter<QueryModel>();
    @Output() onReset = new EventEmitter<QueryModel>();

    modelQuery = new QueryModel();
    isLoading = false;
    _selectedServicer = null;
    servicerSearchCondition = {
        fields: 'fullName,phone,code'
    };
    groups: Selection[] = [];

    set selectedServicer(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedServicer = value;
        }
    }

    get selectedServicer() {
        return this._selectedServicer;
    }

    constructor(private servicerService: ServicerService) { }

    async ngOnInit() {
        await this.getGroups();
    }

    reset() {
        this.modelQuery = new QueryModel();
        this._selectedServicer = null;
        CommonHelper.resetForm(this.filterLimitOrdersForm);
        this.onReset.emit(new QueryModel());
    }

    search() {
        const modelQuery = this.getQuery();
        modelQuery.page = 1;
        this.onSearch.emit(modelQuery);
    }

    getQuery() {
        const modelQuery = _.cloneDeep(this.modelQuery);

        if (!_.isEmpty(this._selectedServicer)) {
            modelQuery.servicerIds = this._selectedServicer;
        } else {
            delete modelQuery.servicerIds;
        }

        return modelQuery;
    }

    async getGroups() {
        const result = await this.servicerService.getGroupServicers(new QueryModel({ limit: 1000 }));
        this.groups = result.data;
    }
}
