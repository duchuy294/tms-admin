import { forEach } from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  timeMaps = {
    'years': 'năm',
    'year': 'năm',
    'months': 'tháng',
    'month': 'tháng',
    'days': 'ngày',
    'day': 'ngày',
    'hours': 'giờ',
    'hour': 'giờ',
    'minutes': 'phút',
    'minute': 'phút',
    'seconds': 'giây',
    'second': 'giây',
    'few': 'vài'
  };

  transform(value: string): any {
    let timeInput = value;
    forEach(this.timeMaps, (val, key) => {
      timeInput = timeInput.replace(key, val);
    });
    if (/ago/.test(timeInput)) {
      timeInput = `Cách đây ${timeInput.replace('ago', '').replace(/(an|a)/g, '1')}`;
    }
    return timeInput;
  }

}
