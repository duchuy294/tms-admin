import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'filter-news-category',
    templateUrl: './filter-news-category.component.html'
})

export class FilterNewsCategoryComponent {
    modelQuery = new QueryModel({ status: null });
    isLoading = false;
    startTime: Date;
    endTime: Date;

    @ViewChild('filterNewsCategoryForm') filterNewsCategoryForm: NgForm;

    @Output() onSearch = new EventEmitter<QueryModel>();

    @Output() onReset = new EventEmitter<QueryModel>();

    reset() {
        this.modelQuery = new QueryModel({ status: null });
        this.startTime = null;
        this.endTime = null;
        CommonHelper.resetForm(this.filterNewsCategoryForm);
        this.onReset.emit(new QueryModel({ status: null }));
    }

    search() {
        if (this.startTime) {
            this.modelQuery.startTime = DateTimeService.convertDateToTimestamp(this.startTime);
        } else {
            delete this.modelQuery.startTime;
        }
        if (this.endTime) {
            this.modelQuery.endTime = DateTimeService.convertDateToTimestamp(this.endTime, null, true);
        } else {
            delete this.modelQuery.endTime;
        }
        this.modelQuery.page = 1;
        this.onSearch.emit(this.modelQuery);
    }
}