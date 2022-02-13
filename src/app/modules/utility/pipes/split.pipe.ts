import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform(value: string, sep: string = ',', join?: boolean): any {
    const splitValue = value.split(sep);
    if (join) {
      return splitValue.join('<br/>');
    }
    return splitValue;
  }

}
