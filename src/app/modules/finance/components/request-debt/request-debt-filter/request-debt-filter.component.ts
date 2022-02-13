import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { RequestCod } from '@/constants/RequestCod';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'request-debt-filter',
    templateUrl: './request-debt-filter.component.html'
})
export class RequestDebtFilterComponent {
    @ViewChild('form') form: NgForm;

    @Output() search = new EventEmitter<QueryModel>();
    @Output() export = new EventEmitter<QueryModel>();
    @Output() onReset = new EventEmitter<QueryModel>();
    @Input() display: boolean;
    queryModel = new QueryModel({ userType: 'servicer', hasConfirmedCOD: null });
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    searchTime: Date[];
    servicerSearchCondition = {
        fields: 'fullName,phone,code',
        status: `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED},${Status.DELETED}`
    };

    requestCod = RequestCod;
    _selectedServicer = null;
    
    constructor(
        public userService: CustomerService,
        public servierService: ServicerService,
        public modalService: ModalService,
        public translateService: TranslateService
    ) { }
    
    set selectedServicer(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedServicer = value;
        }
    }

    get selectedServicer() {
        return this._selectedServicer;
    }

    async searchEvent() {
        if (!_.isEmpty(this._selectedServicer)) {
            this.queryModel.userIds = this._selectedServicer;
        } else {
            delete this.queryModel.userIds;
        }
        this.search.emit(this.queryModel);
    }

    reset() {
        this.queryModel = new QueryModel({ userType: 'servicer', hasConfirmedCOD: null });
        CommonHelper.resetForm(this.form);
        this.searchEvent();
    }

    async exportEvent() {
        this.searchEvent();
        this.export.emit(this.queryModel);
    }
}
