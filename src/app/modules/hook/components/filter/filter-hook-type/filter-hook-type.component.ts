import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Hook } from '../../../const/hook.const';
import { HookTypeQueryModel } from './../../../models/hook-type-query.model';
import { NgForm } from '@angular/forms';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'filter-hook-type',
    templateUrl: './filter-hook-type.component.html',
    styleUrls: ['./filter-hook-type.component.less']
})

export class FilterHookTypeComponent {
    modelQuery = new HookTypeQueryModel({ status: null });
    types = Hook.types;
    statuses = Hook.statuses;
    isLoading = false;

    @ViewChild('filterHookTypeForm') filterHookTypeForm: NgForm;

    @Output() onSearch = new EventEmitter<HookTypeQueryModel>();

    @Output() onReset = new EventEmitter<HookTypeQueryModel>();

    reset() {
        this.modelQuery = new HookTypeQueryModel({ status: null });
        CommonHelper.resetForm(this.filterHookTypeForm);
        this.onReset.emit(new HookTypeQueryModel({ page: 1, limit: 20, status: `${Status.NEW},${Status.ACTIVE}` }));
    }

    search() {
        this.modelQuery.page = 1;
        this.onSearch.emit(this.modelQuery);
    }
}