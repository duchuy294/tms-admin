import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Customer } from 'app/modules/customer/models/customer-detail.model';
import { CustomerService } from 'app/modules/customer/services/customer.service';
import { NgForm } from '@angular/forms';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RestrictedReachModel } from 'app/modules/order/models/restricted-reach.model';
import { RestrictedReachService } from 'app/modules/order/services/restricted-reach.service';
import { ServicerModel } from 'app/modules/report/models/servicer-model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { ServicerType } from 'app/constants/ServicerType';

@Component({
    selector: 'restricted-reach-modify',
    templateUrl: 'restricted-reach-modify.component.html'
})
export class RestrictedReachModifyComponent implements OnInit, OnChanges {
    @Input() visibleModal = false;
    @Input() model = new RestrictedReachModel();
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() updated = new EventEmitter();
    error = new RestrictedReachModel();
    @ViewChild('restrictedReachModifyForm') restrictedReachModifyForm: NgForm;
    public userPaging = new PagingModel<Customer>();
    public servicerPaging = new PagingModel<ServicerModel>();
    public userQuery = new QueryModel({ limit: 10, fields: '_id,fullName,type,code' });
    public servicerQuery = new QueryModel({
        limit: 10,
        type: `${ServicerType.EnterpriseStaff},${ServicerType.Personal}`,
        fields: '_id,fullName,type,code'
    });

    constructor(
        private restrictedReachService: RestrictedReachService, private userService: CustomerService, private servicerService: ServicerService
    ) { }

    async ngOnInit() {
        this.loadData();
    }

    async ngOnChanges() {
        this.error = new RestrictedReachModel();
        if (this.visibleModal) {
            this.loadData();
        }
    }

    async loadData() {
        if (!_.isEmpty(this.model.userIds)) {
            this.userQuery.userIds = this.model.userIds.join(',');
        }
        if (!_.isEmpty(this.model.servicerIds)) {
            this.servicerQuery.servicerIds = this.model.servicerIds.join(',');
        }
        this.userPaging = await this.userService.getCustomers(this.userQuery);
        this.servicerPaging = await this.servicerService.filter(this.servicerQuery);
    }

    async confirm() {
        this.error = new RestrictedReachModel();
        const result = this.model._id
            ? await this.restrictedReachService.update(this.model)
            : await this.restrictedReachService.create(this.model);
        if (result.errorCode === 0) {
            this.reset();
            this.handleVisibleModal(false);
            this.updated.emit();
        } else {
            this.handlError(result.data);
        }
    }

    reset() {
        this.restrictedReachModifyForm.reset();
        CommonHelper.resetForm(this.restrictedReachModifyForm, this.model);
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

    async searchServicer(data: string) {
        this.servicerQuery.servicerIds = null;
        if (this.isSearchByCode(data)) {
            _.assignIn(this.servicerQuery, {
                name: null,
                code: data
            });
        } else {
            _.assignIn(this.servicerQuery, {
                name: data,
                code: null
            });
        }
        this.servicerPaging = await this.servicerService.filter(this.servicerQuery);
    }

    async searchUser(data: string) {
        this.userQuery.userIds = null;
        if (this.isSearchByCode(data)) {
            _.assignIn(this.userQuery, {
                name: null,
                code: data
            });
        } else {
            _.assignIn(this.userQuery, {
                name: data,
                code: null
            });
        }
        this.userPaging = await this.userService.getCustomers(this.userQuery);
    }

    isSearchByCode(value: string): boolean {
        return value.length === 8;
    }

}