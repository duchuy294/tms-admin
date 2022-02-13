import { ActionPayload } from '@/constants/ActionPayLoad';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, delay, map, mergeMap, switchMap } from 'rxjs/operators';
import { DashboardStatisticsActionTypes, GetServicersListFail, GetServicersListSuccess, GetTotalCollectionFeeListFail, GetTotalCollectionFeeListSuccess, GetTotalOrdersListFail, GetTotalOrdersListSuccess, LoadStatisticsFail, LoadStatisticsSuccess } from '../actions/dashboard-statistics.actions';
import { ReportServiceObservable } from '../services/report.service.observable';

@Injectable()
export class DashboardEffects {
  @Effect()
  getStatistics$ = this.actions$.pipe(
    ofType(DashboardStatisticsActionTypes.getStatistics),
    switchMap((action: ActionPayload) => {
      return this.reportService.getStatistics(action.payload).pipe(
        map(servicers => new LoadStatisticsSuccess(servicers)),
        catchError(error => of(new LoadStatisticsFail(error)))
      );
    })
  );


  @Effect()
  getTotalCollectionDebt$ = this.actions$.pipe(
    ofType(DashboardStatisticsActionTypes.getTotalCollectionFeeList),
    switchMap((action: ActionPayload) => {
      return this.reportService.getTotalCollectionDebt(action.payload).pipe(
        map(response => new GetTotalCollectionFeeListSuccess(response.data)),
        catchError(error => of(new GetTotalCollectionFeeListFail(error)))
      );
    })
  );

  @Effect()
  getTotalOrders$ = this.actions$.pipe(
    ofType(DashboardStatisticsActionTypes.getTotalOrdersList),
    switchMap((action: ActionPayload) => {
      if (action.payload === 'cancel') {
        return EMPTY;
      }
      return of([]).pipe(
        delay(0),
        mergeMap(() => this.reportService.getOrders(action.payload).pipe(
          map(response => new GetTotalOrdersListSuccess(response.data)),
          catchError(error => of(new GetTotalOrdersListFail(error)))
        )));
    })
  );

  @Effect()
  getServicersList$ = this.actions$.pipe(
    ofType(DashboardStatisticsActionTypes.getServicers),
    switchMap((action: ActionPayload) => {
      return this.reportService.getServicers(action.payload).pipe(
        map(response => new GetServicersListSuccess(response.data)),
        catchError(error => of(new GetServicersListFail(error)))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private reportService: ReportServiceObservable
  ) { }
}
