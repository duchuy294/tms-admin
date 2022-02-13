import * as _ from 'lodash';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { Component, EventEmitter, Output } from '@angular/core';
import { ContactStatus } from '@/constants/ContactStatus';
import { DateTimeService } from '@/utility/services/datetime.service';
import { QueryModel } from '@/models/query.model';

@Component({
  selector: 'warehouse-contact-filter',
  templateUrl: './warehouse-contact-filter.component.html'
})
export class WarehouseContactFilterComponent {
  @Output() search: EventEmitter<QueryModel> = new EventEmitter<QueryModel>();
  baseQueryModel: QueryModel = new QueryModel({ statistic: true, status: null });
  model: QueryModel = new QueryModel(this.baseQueryModel);
  statusList = [ContactStatus.WatingToConfirm, ContactStatus.Completed, ContactStatus.Fail];
  ranges = {
    Today: [new Date(), new Date()]
  };
  _createdAt: Date[];
  _selectedUser = null;
  customerSearchCondition = {
    fields: 'fullName,phone,code'
  };

  set selectedUser(value) {
    if (_.isArray(value) || (value === null)) {
      this._selectedUser = value;
      this.model.userId = value;
    }
  }

  get selectedUser() {
    return this._selectedUser;
  }


  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    if (_.isEmpty(value)) {
      delete this.model.startTime;
      delete this.model.endTime;
    } else {
      this.model.startTime = DateTimeService.convertDateToTimestamp(value[0], null);
      this.model.endTime = DateTimeService.convertDateToTimestamp(value[1], null, true);
    }
    this._createdAt = value;
  }


  searchFilter() {
    this.search.emit(this.model);
  }

  reset() {
    this.model = new QueryModel(this.baseQueryModel);
    this._createdAt = [];
    this._selectedUser = null;
  }

  resetFilter() {
    this.reset();
    this.searchFilter();
  }
}
