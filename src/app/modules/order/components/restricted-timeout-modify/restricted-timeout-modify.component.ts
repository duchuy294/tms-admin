import * as _ from 'lodash';
import * as ns from 'moment';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Customer } from 'app/modules/customer/models/customer-detail.model';
import { CustomerService } from 'app/modules/customer/services/customer.service';
import { NgForm } from '@angular/forms';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RestrictedTimeoutModel } from '../../models/restricted-timeout.model';
import { RestrictedTimeoutService } from '../../services/restricted-timeout.service';
import { ServicerModel } from 'app/modules/report/models/servicer-model';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'restricted-timeout-modify',
    templateUrl: 'restricted-timeout-modify.component.html'
})
export class RestrictedTimeoutModifyComponent implements OnInit, OnChanges {
    @Input() visibleModal = false;
    @Input() model = new RestrictedTimeoutModel();
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() updated = new EventEmitter();
    error = new RestrictedTimeoutModel();
    @ViewChild('restrictedModifyForm') restrictedModifyForm: NgForm;
    public userPaging = new PagingModel<Customer>();
    public servicerPaging = new PagingModel<ServicerModel>();
    public userQuery = new QueryModel({ limit: 10, fields: 'fullName,type,code' });
    isSearching: boolean = false;
    duration: Date;
    searchChange$: any;
    subscription: any;
    accountOptionList: any;

    constructor(
        private restrictedTimeoutService: RestrictedTimeoutService,
        private userService: CustomerService,
        public translateService: TranslateService
    ) { }

    async ngOnInit() {
        this.loadData();
    }

    async ngOnChanges() {
        this.error = new RestrictedTimeoutModel();
        if (this.visibleModal) {
            this.loadData();
        }
    }

    async loadData() {
        this.userQuery.userId = this.model.userId;
        this.userPaging = await this.userService.getCustomers(this.userQuery);
        this.duration = new Date();
        this.duration.setHours(0, 0, 0, 0);
        this.duration.setSeconds(this.model.duration);
    }

    async confirm() {
        this.error = new RestrictedTimeoutModel();
        if (!_.isEmpty(this.model.userId)) {
            this.model.duration = ns.duration({
                seconds: this.duration.getSeconds(),
                minutes: this.duration.getMinutes(),
                hours: this.duration.getHours(),
            }).asSeconds();
            const result = this.model._id
                ? await this.restrictedTimeoutService.update(this.model)
                : await this.restrictedTimeoutService.create(this.model);
            if (result.errorCode === 0) {
                this.reset();
                this.handleVisibleModal(false);
                this.updated.emit();
            } else {
                this.handlError(result.data);
            }
        } else {
            this.error.userId = this.translateService.instant('order.restricted-timeout.modify-customer-error');
        }
    }

    reset() {
        this.restrictedModifyForm.reset();
        CommonHelper.resetForm(this.restrictedModifyForm, this.model);
    }

    handlError(data: { field: string; message: string }[]) {
        if (this.visibleModal) {
            data.forEach(item => {
                this.error[item.field] = item.message;
            });
        }
    }

    handleVisibleModal(flag = true) {
        this.handleVisible.emit(flag);
    }

    async searchUser(data: string) {
        _.assignIn(this.userQuery, {
            autoSuggest: data
        });
        this.userPaging = await this.userService.getCustomers(this.userQuery);
    }

    isSearchByCode(value: string): boolean {
        return value.length === 8;
    }

}