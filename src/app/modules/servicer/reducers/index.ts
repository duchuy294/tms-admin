import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromServicer from './servicer.reducer';
import * as fromTeam from './team.reducer';

export interface ServicerState {
    servicer: fromServicer.ServicerState;
    team: fromTeam.TeamState;
}

export const reducers: ActionReducerMap<ServicerState> = {
    servicer: fromServicer.reducer,
    team: fromTeam.reducer
};

export const getServicersState = createFeatureSelector<ServicerState>(
    'servicer'
);

export const selectServicer = createSelector(getServicersState, (state: ServicerState) => state.servicer);
export const selectServicerData = createSelector(selectServicer, (state) => state.datas);
export const selectServicerGroups = createSelector(selectServicer, (state) => state.groups);
export const selectServicerCurrentGroup = createSelector(selectServicer, (state) => state.currentGroup);
export const selectServicerState = createSelector(selectServicer, (state) => state.totalServicersState);
export const selectTeam = createSelector(getServicersState, (state: ServicerState) => state.team);

