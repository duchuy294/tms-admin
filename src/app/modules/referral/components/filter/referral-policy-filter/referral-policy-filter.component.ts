import * as moment from 'moment';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ReferralPolicyQueryModel } from '@/modules/referral/models/referral-policy-query.model';
import { Status } from '@/constants/status.enum';

@Component({
  selector: 'referral-policy-filter',
  templateUrl: './referral-policy-filter.component.html'
})
export class ReferralpolicyFilterComponent {

  modelQuery = new ReferralPolicyQueryModel();
  fromDate: any;
  toDate: any;
  isLoading: boolean = false;
  visibleFilter: boolean = false;

  @ViewChild('referralPolicyFilter') referralPolicyFilter: NgForm;

  @Output() onClickSearch = new EventEmitter<ReferralPolicyQueryModel>();

  @Output() onClickClearFilter = new EventEmitter<ReferralPolicyQueryModel>();

  clickSearch() {
    this.modelQuery.page = 1;
    this.onClickSearch.emit(this.modelQuery);
  }

  clickClearFilter() {
    this.fromDate = null;
    this.toDate = null;
    this.modelQuery = new ReferralPolicyQueryModel();
    CommonHelper.resetForm(this.referralPolicyFilter);
    this.onClickClearFilter.emit(new ReferralPolicyQueryModel({ page: 1, limit: 20, status: `${Status.NEW},${Status.ACTIVE}` }));
  }

  onChangeFromDate($event) {
    if ($event) {
      this.fromDate.setHours(0);
      this.fromDate.setMinutes(0);
      this.fromDate.setSeconds(0);
      this.modelQuery.startTime = Number(moment(this.fromDate).format('x'));
    } else {
      this.modelQuery.startTime = null;
    }
  }

  onChangeToDate($event) {
    if ($event) {
      this.toDate.setHours(23);
      this.toDate.setMinutes(59);
      this.toDate.setSeconds(59);
      this.modelQuery.endTime = Number(moment(this.toDate).format('x'));
    } else {
      this.modelQuery.endTime = null;
    }
  }

  async tonggleVisibleFilter() {
    this.visibleFilter = !this.visibleFilter;
  }
}
