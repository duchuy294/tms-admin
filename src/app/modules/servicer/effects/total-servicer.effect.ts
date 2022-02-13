import { ActionPayload } from '@/constants/ActionPayLoad';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadTotalServicersStateFail, LoadTotalServicersStateSuccess, TotalServicerActionTypes } from '../actions/servicer.actions';
import { of } from 'rxjs';
import { ReportServiceObservable } from '@/modules/report/services/report.service.observable';

@Injectable()
export class TotalServicerEffects {
    @Effect()
    getTotalServicersState$ = this.actions$.pipe(
        ofType(TotalServicerActionTypes.getTotalServicersState),
        switchMap((action: ActionPayload) => {
            return this.reportService.getTotalServicerState(action.payload).pipe(
                map(servicers => new LoadTotalServicersStateSuccess(servicers)),
                catchError(error => of(new LoadTotalServicersStateFail(error)))
            );
        })
    );

    constructor(
        private actions$: Actions,
        private reportService: ReportServiceObservable
    ) { }
}
