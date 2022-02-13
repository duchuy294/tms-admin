import * as _ from 'lodash';
import { SessionCodStatusEnum } from '@/modules/finance/const/SessionCodStatusEnum';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { DateTimeService } from '@/utility/services/datetime.service';
import { GetBalanceQueryModel } from '@/modules/finance/models/query.model';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'session-cod-filter',
    templateUrl: './session-cod-filter.component.html'
})
export class SessionCodFilterComponent {
    @ViewChild('form') form: NgForm;

    @Output() search = new EventEmitter<GetBalanceQueryModel>();
    @Output() export = new EventEmitter<GetBalanceQueryModel>();
    @Output() onReset = new EventEmitter<QueryModel>();
    @Input() display: boolean;
    queryModel = new GetBalanceQueryModel();
    userCode: string = '';
    searchTime: Date[];
    transfer: Date[];
    _selectedUser: any;
    customerSearchCondition = {
        fields: 'fullName,phone,code',
        status: `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED},${Status.DELETED}`
    };

    public statuses: SessionCodStatusEnum[] = [
        SessionCodStatusEnum.NOTDELIVERED,
        SessionCodStatusEnum.DELIVERED,
    ];

    set selectedUser(value) {
        if (_.isArray(value) || value === null) {
            this._selectedUser = value;
            this.queryModel.userIds = value;
        }
    }

    get selectedUser() {
        return this._selectedUser;
    }

    constructor(
        public userService: CustomerService,
        public servierService: ServicerService,
        public modalService: ModalService,
        public translateService: TranslateService
    ) { }

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
        if (!_.isEmpty(this.transfer)) {
            this.queryModel.transferFrom = DateTimeService.convertDateToTimestamp(
                this.transfer[0]
            );
            this.queryModel.transferTo = DateTimeService.convertDateToTimestamp(
                this.transfer[1],
                null,
                true
            );
        } else {
            delete this.queryModel.transferFrom;
            delete this.queryModel.transferTo;
        }
    }

    async searchEvent() {
        this.processTime();
        this.search.emit(this.queryModel);
    }

    reset() {
        this.queryModel = new GetBalanceQueryModel();
        this.searchTime = [];
        this._selectedUser = null;
        CommonHelper.resetForm(this.form);
        this.searchEvent();
    }

    async exportEvent() {
        this.searchEvent();
        this.export.emit(this.queryModel);
    }
}
