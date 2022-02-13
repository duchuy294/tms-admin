import * as moment from 'moment';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { PromotionCodeHistoryQuery } from '@/modules/marketing/models/promotion-code-history-query.model';
import { PromotionPolicyService } from '@/modules/marketing/services/promotion-policy.service';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';

@Component({
  selector: 'promotion-code-history-filter',
  templateUrl: './promotion-code-history-filter.component.html',
  styleUrls: ['./promotion-code-history-filter.component.less']
})
export class PromotionCodeHistoryFilterComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() onClickClearFilter = new EventEmitter<PromotionCodeHistoryQuery>();
  @Output() search = new EventEmitter<PromotionCodeHistoryQuery>();
  @ViewChild('form') form: NgForm;

  statuses = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];
  queryModel = new PromotionCodeHistoryQuery({ status: null });
  _startTime: any;
  _endTime: any;
  isLoading: boolean = false;
  policyList = [];

  get startTime(): Date {
    return this._startTime;
  }

  set startTime(start) {
    this._startTime = start;
    this.queryModel.startTime = start ? DateTimeService.convertDateToTimestamp(this._startTime) : null;
  }

  get endTime(): Date {
    return this._endTime;
  }

  set endTime(end) {
    this._endTime = end;
    this.queryModel.endTime = end ? DateTimeService.convertDateToTimestamp(this._endTime, null, true) : null;
  }


  async ngOnInit() {
    await this.loadPolicylist();
  }
  constructor(
    private promotionPolicyService: PromotionPolicyService
  ) { }


  onSearch() {
    this.search.emit(this.queryModel);
  }

  onReset() {
    this._startTime = null;
    this._endTime = null;
    this.queryModel = new PromotionCodeHistoryQuery({ status: null });
    CommonHelper.resetForm(this.form);
    this.onSearch();
  }

  async loadPolicylist() {
    this.policyList = (await this.promotionPolicyService.getPromotionPolicyFilter
      (new QueryModel({ fields: 'name' }))).data;
  }

  onChangeFromDate($event) {
    if ($event) {
      this.startTime.setHours(0);
      this.startTime.setMinutes(0);
      this.startTime.setSeconds(0);
      this.queryModel.startTime = Number(moment(this.startTime).format('x'));
    } else {
      this.queryModel.startTime = null;
    }
  }

  onChangeToDate($event) {
    if ($event) {
      this.endTime.setHours(23);
      this.endTime.setMinutes(59);
      this.endTime.setSeconds(59);
      this.queryModel.endTime = Number(moment(this.endTime).format('x'));
    } else {
      this.queryModel.endTime = null;
    }
  }
}
