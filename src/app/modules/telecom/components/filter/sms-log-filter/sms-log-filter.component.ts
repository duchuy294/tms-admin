import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { ProviderService } from '@/modules/telecom/services/provider.service';
import { QueryModel } from '@/models/query.model';
import { SMSTYPE } from '@/constants/SmsType';

@Component({
  selector: 'sms-log-filter',
  templateUrl: './sms-log-filter.component.html'
})
export class SmsLogFilterComponent implements OnInit {
  @Output() modelChange = new EventEmitter();
  @Output() onReset = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  private _endTime: Date;
  private _startTime: Date;
  queryModel = new QueryModel({ status: null });
  smsTypeOptionList: number[] = [];
  telecomOptionList = [];

  get startTime(): Date {
    return this._startTime;
  }

  set startTime(start) {
    this._startTime = start;
    if (this._startTime) {
      this.queryModel.startTime = DateTimeService.convertDateToTimestamp(start);
    } else {
      this.queryModel.startTime = null;
    }
  }

  get endTime(): Date {
    return this._endTime;
  }

  set endTime(end: Date) {
    this._endTime = end;
    if (this._endTime) {
      this.queryModel.endTime = DateTimeService.convertDateToTimestamp(end, null, true);
    } else {
      this.queryModel.endTime = null;
    }
  }

  constructor(
    private providerService: ProviderService
  ) { }

  async ngOnInit() {
    for (const field in SMSTYPE) {
      if (SMSTYPE.hasOwnProperty(field)) {
        this.smsTypeOptionList.push(SMSTYPE[field]);
      }
    }
    const response = await this.providerService.filter(new QueryModel({ limit: 1000 }));
    this.telecomOptionList = response.data;
  }

  init() {
    this._startTime = null;
    this._endTime = null;
  }

  reset() {
    this.queryModel = new QueryModel({ status: null });
    this.init();
    setTimeout(() => {
      this.onReset.emit(this.queryModel);
    }, 100);
  }

  search() {
    this.queryModel.page = 1;
    setTimeout(() => {
      this.onSearch.emit(this.queryModel);
    }, 100);
  }
}
