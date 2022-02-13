import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { DateTimeService } from '@/utility/services/datetime.service';
import { GetBalanceQueryModel } from '@/modules/finance/models/query.model';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { RequestCod } from '@/constants/RequestCod';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'request-cod-filter',
    templateUrl: './request-cod-filter.component.html'
})
export class RequestCodFilterComponent {
    @ViewChild('form') form: NgForm;

    @Output() search = new EventEmitter<GetBalanceQueryModel>();
    @Output() export = new EventEmitter<GetBalanceQueryModel>();
    @Output() onReset = new EventEmitter<QueryModel>();
    @Input() display: boolean;
    queryModel = new GetBalanceQueryModel();
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

    processTime() {
        if (!_.isEmpty(this.searchTime)) {
            this.queryModel.startTime = DateTimeService.convertDateToTimestamp(
                this.searchTime[0]
            );
            this.queryModel.endTime = DateTimeService.convertDateToTimestamp(
                this.searchTime[1],
                null,
                true
            );
        } else {
            delete this.queryModel.startTime;
            delete this.queryModel.endTime;
        }
    }

    async searchEvent() {
        this.processTime();
        if (!_.isEmpty(this._selectedServicer)) {
            this.queryModel.servicerId = this._selectedServicer;
        } else {
            delete this.queryModel.servicerId;
        }
        this.search.emit(this.queryModel);
    }

    reset() {
        this.queryModel = new GetBalanceQueryModel();
        this.searchTime = [];
        this._selectedServicer = null;
        CommonHelper.resetForm(this.form);
        this.searchEvent();
    }

    async exportEvent() {
        this.searchEvent();
        this.export.emit(this.queryModel);
    }
}
