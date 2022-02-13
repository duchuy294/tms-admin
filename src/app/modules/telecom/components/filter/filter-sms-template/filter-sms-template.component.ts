import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SmsTemplate } from '@/modules/telecom/const/sms-template.const';
import { SmsTemplateQueryModel } from '@/modules/telecom/models/sms-template-query.model';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'filter-sms-template',
    templateUrl: './filter-sms-template.component.html',
    styleUrls: ['./filter-sms-template.component.less']
})

export class FilterSmsTemplateComponent {
    @Output() onReset = new EventEmitter<SmsTemplateQueryModel>();
    @Output() onSearch = new EventEmitter<SmsTemplateQueryModel>();
    @ViewChild('filterSmsTemplateForm') filterSmsTemplateForm: NgForm;
    isLoading: boolean = false;
    modelQuery: SmsTemplateQueryModel = new SmsTemplateQueryModel({ status: null });
    statuses = SmsTemplate.statuses;
    types = SmsTemplate.types;

    reset() {
        this.modelQuery = new SmsTemplateQueryModel({ status: null });
        CommonHelper.resetForm(this.filterSmsTemplateForm);
        this.onReset.emit(new SmsTemplateQueryModel({ page: 1, limit: 20, status: `${Status.NEW},${Status.ACTIVE}` }));
    }

    search() {
        this.modelQuery.page = 1;
        this.onSearch.emit(this.modelQuery);
    }
}