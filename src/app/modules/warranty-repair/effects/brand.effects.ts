import { ActionPayload } from '@/constants/ActionPayLoad';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { BrandActionTypes, LoadBrandsFail, LoadBrandsSuccess } from '../actions/brand.actions';
import { BrandServiceObservable } from '../services/brand.service.observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class BrandEffects {
    @Effect()
    getBrands$ = this.actions$.pipe(
        ofType(BrandActionTypes.getBrands),
        switchMap((action: ActionPayload) => {
            return this.service.getBrands(action.payload).pipe(
                map(response => new LoadBrandsSuccess(response.data)),
                catchError(error => of(new LoadBrandsFail(error)))
            );
        })
    );

    constructor(
        private actions$: Actions,
        private service: BrandServiceObservable
    ) { }
}
