import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ActionPayload } from '@/constants/ActionPayLoad';
import { StoreActionTypes, LoadStoresSuccess, LoadStoresFail, EditStoreSuccess, EditStoreFail, AddStoreSuccess, AddStoreFail, DeleteStoreSuccess, DeleteStoreFail } from '../actions/store.actions';
import { StoreServiceObservable } from '../services/store.service.observable';

@Injectable()
export class StoreEffects {
    @Effect()
    getStores$ = this.actions$.pipe(
        ofType(StoreActionTypes.getStores),
        switchMap((action: ActionPayload) => {
            return this.service.getStores(action.payload).pipe(
                map(response => new LoadStoresSuccess(response.data)),
                catchError(error => of(new LoadStoresFail(error)))
            );
        })
    );

    @Effect()
    editStore$ = this.actions$.pipe(
        ofType(StoreActionTypes.editStore),
        switchMap((action: ActionPayload) => {
            return this.service.update(action.payload).pipe(
                map(response => new EditStoreSuccess(response.data)),
                catchError(error => of(new EditStoreFail(error)))
            );
        })
    );

    @Effect()
    addStore$ = this.actions$.pipe(
        ofType(StoreActionTypes.addStore),
        switchMap((action: ActionPayload) => {
            return this.service.create(action.payload).pipe(
                map(response => new AddStoreSuccess(response.data)),
                catchError(error => of(new AddStoreFail(error)))
            );
        })
    );

    @Effect()
    deleteStore$ = this.actions$.pipe(
        ofType(StoreActionTypes.deleteStore),
        switchMap((action: ActionPayload) => {
            return this.service.delete(action.payload).pipe(
                map(() => new DeleteStoreSuccess()),
                catchError(() => of(new DeleteStoreFail()))
            );
        })
    );

    constructor(
        private actions$: Actions,
        private service: StoreServiceObservable
    ) { }
}
