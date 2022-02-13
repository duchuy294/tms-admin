import * as _ from 'lodash';
import { CommonHelper } from './../../../../../utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateTimeService } from './../../../../../utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from './../../../../../../models/query.model';
import { UserStatus } from './../../../../../../constants/UserStatus';

@Component({
  selector: 'reward-provider-filter',
  templateUrl: './reward-provider-filter.component.html'
})
export class RewardProviderFilterComponent {
  query = new QueryModel();
  @ViewChild('filter')
  filter: NgForm;
  searchTime: Date[] = [];
  @Input() display: boolean = false;
  @Output() search = new EventEmitter<QueryModel>();
  @Output() onReset = new EventEmitter<QueryModel>();
  statuses: UserStatus[] = [UserStatus.NEW, UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED];

  async reset() {
    this.query = new QueryModel();
    this.searchTime = [];
    CommonHelper.resetForm(this.filter);
    const defaultPage = 1;
    const defaultLimit = 20;
    this.onReset.emit(new QueryModel({ page: defaultPage, limit: defaultLimit }));
  }

  searchEvent() {
    if (!_.isEmpty(this.searchTime)) {
      this.query.startTime = DateTimeService.convertDateToTimestamp(this.searchTime[0]);
      this.query.endTime = DateTimeService.convertDateToTimestamp(this.searchTime[1], null, true);
    } else {
      delete this.query.startTime;
      delete this.query.endTime;
    }
    this.query.page = 1;
    this.search.emit(this.query);
  }
}
