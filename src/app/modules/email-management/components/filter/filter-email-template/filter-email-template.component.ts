import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { EmailTemplate } from '@/modules/email-management/const/email-template.const';
import { EmailTemplateQueryModel } from '@/modules/email-management/models/email-template-query.model';
import { NgForm } from '@angular/forms';
import { Status } from 'app/constants/status.enum';

@Component({
    selector: 'filter-email-template',
    templateUrl: './filter-email-template.component.html',
    styleUrls: ['./filter-email-template.component.less']
})

export class FilterEmailTemplateComponent {
    modelQuery: EmailTemplateQueryModel = new EmailTemplateQueryModel({ status: null });
    types = EmailTemplate.types;
    statuses = EmailTemplate.statuses;
    isLoading: boolean = false;

    @ViewChild('filterEmailTemplateForm') filterEmailTemplateForm: NgForm;

    @Output() onSearch = new EventEmitter();

    @Output() onReset = new EventEmitter();

    reset() {
        this.modelQuery = new EmailTemplateQueryModel({ status: null });
        CommonHelper.resetForm(this.filterEmailTemplateForm);
        this.onReset.emit(new EmailTemplateQueryModel({ page: 1, limit: 20, status: `${Status.NEW},${Status.ACTIVE}` }));
    }

    search() {
        this.modelQuery.page = 1;
        this.onSearch.emit(this.modelQuery);
    }
}