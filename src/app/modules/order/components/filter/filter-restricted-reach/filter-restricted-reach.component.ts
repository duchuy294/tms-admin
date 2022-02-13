import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';

@Component({
  selector: 'filter-restricted-reach',
  templateUrl: 'filter-restricted-reach.component.html'
})
export class FilterRestrictedReachComponent {
  @ViewChild('filterRestrictedReachForm') filterRestrictedReachForm: NgForm;
  @Output() onSearch = new EventEmitter<QueryModel>();
  @Output() onReset = new EventEmitter<QueryModel>();

  modelQuery = new QueryModel();
  isLoading = false;
  _selectedUser = null;
  customerSearchCondition = {
    fields: 'fullName,phone,code'
  };

  set selectedUser(value) {
    if (_.isArray(value) || (value === null)) {
      this._selectedUser = value;
    }
  }

  get selectedUser() {
    return this._selectedUser;
  }

  reset() {
    this.modelQuery = new QueryModel();
    this._selectedUser = null;
    CommonHelper.resetForm(this.filterRestrictedReachForm);
    this.onReset.emit(new QueryModel());
  }

  search() {
    const modelQuery = this.getQuery();
    modelQuery.page = 1;
    this.onSearch.emit(modelQuery);
  }

  getQuery() {
    const modelQuery = _.cloneDeep(this.modelQuery);

    if (!_.isEmpty(this._selectedUser)) {
      modelQuery.userIds = this._selectedUser;
    } else {
      delete modelQuery.userIds;
    }

    return modelQuery;
  }
}
