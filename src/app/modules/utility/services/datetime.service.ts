import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export class DateTimeService {
    public static convertDateStructToString(datetime: NgbDateStruct = null) {
        datetime = datetime ? datetime : this.getDate();
        return `${datetime.year}-${datetime.month}-${datetime.day}`;
    }

    public static convertTimeStructToString(time: NgbTimeStruct) {
        return `${time.hour}-${time.minute}`;
    }

    public static getDate(dayOffset: number = 0): NgbDateStruct {
        const now = moment().add(dayOffset, 'd');
        return {
            year: now.year(),
            month: now.month() + 1,
            day: now.date()
        };
    }

    public static convertDateStructToTimestamp(datetime: NgbDateStruct | any, isEnd = false) {
        return parseInt(moment(new Date(datetime.year, datetime.month - 1, datetime.day)).add(isEnd ? 1 : 0, 'd').format('x'));
    }

    public static convertDateToTimestamp(datetime: Date, timezone = null, endDate = false) {
        let value = moment(datetime).startOf('day');
        if (endDate) {
            value.add(1, 'day').add(-1, 'second');
        }

        if (timezone) {
            const time = momentTZ(value);
            value = time.tz(timezone);
        }

        return value.valueOf();
    }

    public static convertTimestampToDate(timestamp: number) {
        return moment(timestamp);
    }

    public static getFirstDateOfMonth(date: Date = new Date()) {
        return new Date(date.getFullYear(), date.getMonth(), 1); // local time
    }

    public static getLastDateOfMonth(date: Date = new Date()) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0); // local time
    }
}
