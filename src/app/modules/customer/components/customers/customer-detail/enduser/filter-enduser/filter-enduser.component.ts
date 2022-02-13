import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { SearchAndSuggestEndUserComponentComponent } from './../search-and-suggest-end-user-component/search-and-suggest-end-user-component.component';

@Component({
  selector: 'filter-enduser',
  templateUrl: './filter-enduser.component.html',
  styleUrls: ['./filter-enduser.component.less']
})
export class FilterEnduserComponent implements OnInit {
  @Output() search = new EventEmitter<QueryModel>();
  model: QueryModel = new QueryModel();
  _selectedEndUser = null;
  @Input() userId;

  @ViewChild('filterEndUser') filterEndUser: NgForm;
  @ViewChild('suggestForm') suggestForm: SearchAndSuggestEndUserComponentComponent;

  set selectedEndUser(value) {
    if (_.isArray(value) || (value === null)) {
      this._selectedEndUser = value;
    }
  }

  get selectedEndUser() {
    return this._selectedEndUser;
  }

  endUserSearchCondition = {
    fields: 'name,phone',
    userId: null
  };

  ngOnInit() {
    this.endUserSearchCondition.userId = this.userId;
  }

  reset() {
    this.model = new QueryModel();
    this._selectedEndUser = null;
    CommonHelper.resetForm(this.filterEndUser);
    this.search.emit(new QueryModel({ page: 1, limit: 20 }));
  }

  resetAutoSuggest() {
    this.suggestForm.reset();
  }

  searchEvent() {
    if (!_.isEmpty(this._selectedEndUser)) {
      this.model.endUserIds = this._selectedEndUser;
    } else {
      delete this.model.endUserIds;
    }
    this.model.page = 1;
    this.search.emit(this.model);
  }

}
