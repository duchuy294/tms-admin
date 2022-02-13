import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
    transform(value: any[], exponent: string): any[] {
        return _.sortBy(value, exponent.split(','));
    }
}