import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Hook } from '../../../const/hook.const';
import { HookLinkQueryModel } from './../../../models/hook-link-query.model';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'filter-hook-link',
    templateUrl: './filter-hook-link.component.html'
})

export class FilterHookLinkComponent {
    modelQuery = new HookLinkQueryModel();
    types = Hook.types;
    isLoading = false;
    selectedUser: any;

    @ViewChild('filterHookLinkForm') filterHookLinkForm: NgForm;

    @Output() onSearch = new EventEmitter<HookLinkQueryModel>();

    @Output() onReset = new EventEmitter<HookLinkQueryModel>();

    reset() {
        this.modelQuery = new HookLinkQueryModel();
        this.selectedUser = null;
        CommonHelper.resetForm(this.filterHookLinkForm);
        this.onReset.emit(new HookLinkQueryModel({ page: 1, limit: 20 }));
    }

    search() {
        this.modelQuery.page = 1;
        if (this.selectedUser) {
            if (this.selectedUser.userType === 'user') {
                this.modelQuery.userId = this.selectedUser._id;
            }
            if (this.selectedUser.userType === 'servicer') {
                this.modelQuery.servicerId = this.selectedUser._id;
            }
        } else {
            delete this.modelQuery.userId;
            delete this.modelQuery.servicerId;
        }
        this.onSearch.emit(this.modelQuery);
    }
}