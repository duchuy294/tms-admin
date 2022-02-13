import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { isArray } from 'lodash';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class EventBusService {
  subject = new Subject<any>();

  on(event: ActionEvent | ActionEvent[], action: any): Subscription {
    return this.subject
      .pipe(
        filter((e: ActionEvent) => {
          return (isArray(event) ? event : [event]).map(v => v.type).includes(e.type);
        }),
        map((e: ActionEvent) => {
          return e.payload;
        })
      )
      .subscribe(action);
  }

  emit(event: ActionEvent) {
    this.subject.next(event);
  }
}

export interface ActionEvent {
  type: string;
  payload?: any;
}