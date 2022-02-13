import * as _ from 'lodash';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { ActivatedRoute } from '@angular/router';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { UserStatus } from '@/constants/UserStatus';

@Component({
  selector: 'group-servicer-detail-filter',
  templateUrl: './group-servicer-detail-filter.component.html'
})
export class GroupServicerDetailFilterComponent {
  @ViewChild('form') form: NgForm;
  @Output() onSearch = new EventEmitter<QueryModel>();
  id = this.route.snapshot.paramMap.get('id');
  modelQuery = new QueryModel({ _id: this.id });
  constructor(
    private route: ActivatedRoute
  ) { }
  ranges1 = { today: [new Date(), new Date()] };
  createdAt: Date[] = [];
  statuses: UserStatus[] = [UserStatus.NEW, UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED];

  reset() {
    this.modelQuery = new QueryModel({ _id: this.id });
    this.createdAt = [];
    CommonHelper.resetForm(this.form);
    this.onSearch.emit(this.modelQuery);
  }

  search() {
    if (!_.isEmpty(this.createdAt)) {
      this.modelQuery.startTime = DateTimeService.convertDateToTimestamp(this.createdAt[0]);
      this.modelQuery.endTime = DateTimeService.convertDateToTimestamp(this.createdAt[1], null, true);
    } else {
      delete this.modelQuery.startTime;
      delete this.modelQuery.endTime;
    }
    this.modelQuery.page = 1;
    this.onSearch.emit(this.modelQuery);
  }
}