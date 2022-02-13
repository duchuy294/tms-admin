import { ActionPayload } from '@/constants/ActionPayLoad';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
    catchError,
    concat,
    map,
    switchMap,
    withLatestFrom
    } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import {
    LoadTeamsByGroupFail,
    LoadTeamsByGroupSuccess,
    ResetCurrentTeam,
    TeamActionTypes,
    UpdateCurrentTeamsSuccess
    } from '../actions/team.action';
import { of } from 'rxjs';
import { ServicerServiceObservable } from '../services/servicer.service.observable';
import { Store } from '@ngrx/store';
import { UpdateCurrentGroup } from '../actions/servicer.actions';

@Injectable()
export class TeamEffects {
    @Effect()
    getTeamsByGroup$ = this.actions$.pipe(
        ofType(TeamActionTypes.getTeamsByGroup),
        withLatestFrom(this.store$),
        switchMap(([action, storeState]) => {
            let obs;
            const groupId = (action as ActionPayload).payload;
            const { servicer: { team: { teamsByGroup } } } = storeState;
            if (!groupId) {
                obs = of(new ResetCurrentTeam());
            } else if (isEmpty(teamsByGroup) || !teamsByGroup[groupId]) {
                obs = this.servicerService.getTeams((action as ActionPayload).payload).pipe(
                    map(response => new LoadTeamsByGroupSuccess(groupId, response)),
                    catchError(error => of(new LoadTeamsByGroupFail(error)))
                );
            } else {
                obs = of(new UpdateCurrentTeamsSuccess(groupId, teamsByGroup));
            }

            return obs.pipe(concat(of(new UpdateCurrentGroup(groupId))));
        })
    );

    constructor(
        private actions$: Actions,
        private servicerService: ServicerServiceObservable,
        private store$: Store<any>
    ) { }
}
