import * as _ from 'lodash';
import { CommonHelper } from './../../../../../modules/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateTimeService } from './../../../../../modules/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from './../../../../../models/query.model';
import { UserStatus } from './../../../../../constants/UserStatus';

@Component({
  selector: 'group-servicer-filter',
  templateUrl: './group-servicer-filter.component.html'
})
export class GroupServicerFilterComponent {
  model = new QueryModel({ fields: 'numberOfOrders' });
  searchTime: Date[] = [];
  statuses: UserStatus[] = [UserStatus.NEW, UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED];
  @Input() display: boolean = false;
  @ViewChild('filterGroupServicer')
  filterGroupServicer: NgForm;
  @Output() search = new EventEmitter<QueryModel>();
  @Output() onReset = new EventEmitter<QueryModel>();
  ranges1 = {
    Today: [new Date(), new Date()]
  };
  async reset() {
    this.model = new QueryModel({ fields: 'numberOfOrders' });
    this.searchTime = [];
    CommonHelper.resetForm(this.filterGroupServicer);
    const defaultPage = 1;
    const defaultLimit = 20;
    this.model.page = defaultPage;
    this.model.limit = defaultLimit;
    this.onReset.emit(this.model);
  }

  searchEvent() {
    if (!_.isEmpty(this.searchTime)) {
      this.model.startTime = DateTimeService.convertDateToTimestamp(this.searchTime[0]);
      this.model.endTime = DateTimeService.convertDateToTimestamp(this.searchTime[1], null, true);
    } else {
      delete this.model.startTime;
      delete this.model.endTime;
    }
    this.model.page = 1;
    this.search.emit(this.model);
  }
}