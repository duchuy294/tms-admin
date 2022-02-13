import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { EmailAccount } from '@/modules/email-management/const/email-account.const';
import { EmailAccountQueryModel } from '@/modules/email-management/models/email-account-query.model';
import { NgForm } from '@angular/forms';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'filter-email-account',
    templateUrl: './filter-email-account.component.html',
    styleUrls: ['./filter-email-account.component.less']
})

export class FilterEmailAccountComponent {
    modelQuery = new EmailAccountQueryModel({ status: null });
    types = EmailAccount.types;
    statuses = EmailAccount.statuses;
    isLoading: boolean = false;

    @ViewChild('filterEmailAccountForm') filterEmailAccountForm: NgForm;

    @Output() onSearch = new EventEmitter();

    @Output() onReset = new EventEmitter();

    reset() {
        this.modelQuery = new EmailAccountQueryModel({ status: null });
        CommonHelper.resetForm(this.filterEmailAccountForm);
        this.onReset.emit(new EmailAccountQueryModel({ page: 1, limit: 20, status: `${Status.NEW},${Status.ACTIVE}` }));
    }

    search() {
        this.modelQuery.page = 1;
        this.onSearch.emit(this.modelQuery);
    }
}