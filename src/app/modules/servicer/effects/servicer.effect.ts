import { ActionPayload } from '@/constants/ActionPayLoad';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    LoadGroupServicersFail,
    LoadGroupServicersSuccess,
    LoadServicersFail,
    LoadServicersSuccess,
    ServicerActionTypes,
    ServicerGroupActionTypes
    } from '../actions/servicer.actions';
import { of } from 'rxjs';
import { ServicerServiceObservable } from '../services/servicer.service.observable';

@Injectable()
export class ServicerEffects {
    @Effect()
    getServicers$ = this.actions$.pipe(
        ofType(ServicerActionTypes.getServicers),
        switchMap((action: ActionPayload) => {
            return this.servicerService.getServicers(action.payload).pipe(
                map(servicers => new LoadServicersSuccess(servicers)),
                catchError(error => of(new LoadServicersFail(error)))
            );
        })
    );

    @Effect()
    getGroupServicers$ = this.actions$.pipe(
        ofType(ServicerGroupActionTypes.getGroupServicers),
        switchMap((action: ActionPayload) => {
            return this.servicerService.getGroupServicers(action.payload).pipe(
                map(({ data }) => new LoadGroupServicersSuccess(data)),
                catchError(error => of(new LoadGroupServicersFail(error)))
            );
        })
    );
    constructor(
        private actions$: Actions,
        private servicerService: ServicerServiceObservable
    ) { }
}
