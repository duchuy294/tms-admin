import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { SearchAndSuggestEndUserComponentComponent } from './../../search-and-suggest-end-user-component/search-and-suggest-end-user-component.component';

@Component({
    selector: 'delivery-point-filter',
    templateUrl: './delivery-point-filter.component.html'
})
export class DeliveryPointFilterComponent {
    @Output() search = new EventEmitter<QueryModel>();
    @Input() endUserId: string = null;
    model: QueryModel = new QueryModel();
    _selectedSubEndUser = null;

    @ViewChild('filterDeliveryPoint') filterDeliveryPoint: NgForm;
    @ViewChild('suggestForm') suggestForm: SearchAndSuggestEndUserComponentComponent;

    set selectedSubEndUser(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedSubEndUser = value;
        }
    }

    get selectedSubEndUser() {
        return this._selectedSubEndUser;
    }

    subEndUserSearchCondition = {
        fields: 'name,phone'
    };


    resetAutoSuggest() {
        this.suggestForm.reset();
    }


    reset() {
        this.model = new QueryModel();
        this._selectedSubEndUser = null;
        CommonHelper.resetForm(this.filterDeliveryPoint);
        this.search.emit(new QueryModel({ page: 1, limit: 20 }));
    }

    searchEvent() {
        if (!_.isEmpty(this._selectedSubEndUser)) {
            this.model.subEndUserIds = this._selectedSubEndUser;
        } else {
            delete this.model.subEndUserIds;
        }
        this.model.page = 1;
        this.search.emit(this.model);
    }

}
