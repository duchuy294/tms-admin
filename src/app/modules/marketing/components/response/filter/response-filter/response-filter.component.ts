import * as moment from 'moment';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'response-filter',
    templateUrl: './response-filter.component.html'
})
export class ResponseFilterComponent implements OnInit {
    private _endTime: Date;
    private _startTime: Date;
    @Input() display: boolean = false;
    queryModel = new QueryModel();
    statusOptions = ['all', 'new', 'replied'];

    @Output() onReset = new EventEmitter<QueryModel>();
    @Output() onSearch = new EventEmitter<QueryModel>();

    get responseCode(): string {
        return this.queryModel.code;
    }
    set responseCode(code: string) {
        this.queryModel.code = code.toLocaleUpperCase();
    }

    get startTime(): Date {
        return this._startTime;
    }

    set startTime(start) {
        this._startTime = start;
        if (this._startTime) {
            this.adjustDate(this._startTime, 0, 0, 0, 0);
            this.queryModel.startTime = Number(moment(this._startTime).format('x'));
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
            this.adjustDate(this._endTime, 23, 59, 59, 999);
            this.queryModel.endTime = Number(moment(this._endTime).format('x'));
        } else {
            this.queryModel.endTime = null;
        }
    }

    ngOnInit() {
        this.queryModel.status = null;
    }

    adjustDate(date, hh, mm, ss, ml) {
        date.setHours(hh);
        date.setMinutes(mm);
        date.setSeconds(ss);
        date.setMilliseconds(ml);
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
