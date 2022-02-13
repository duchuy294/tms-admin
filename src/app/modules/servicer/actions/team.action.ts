import { Action } from '@ngrx/store';

export enum TeamActionTypes {
    getTeams = '[Team] Load Teams',
    getTeamsSuccess = '[Team] Load Teams Success',
    getTeamsFail = '[Team] Load Teams Fail',
    getTeamsByGroup = '[Team] Load Teams By Group',
    getTeamsByGroupSuccess = '[Team] Load Teams By Group Success',
    getTeamsByGroupFail = '[Team] Load Teams By Group Fail',

    updateCurrentTeams = '[Team] Update Current Teams',
    updateCurrentTeamsSuccess = '[Team] Update Current Teams Success',
    updateCurrentTeamsFail = '[Team] Update Current Teams Fail',
    resetCurrentTeam = '[Team] Reset Current Team'
}

export class LoadTeamsByGroup implements Action {
    readonly type = TeamActionTypes.getTeamsByGroup;
    constructor(public payload: any) { }
}

export class LoadTeamsByGroupSuccess implements Action {
    readonly type = TeamActionTypes.getTeamsByGroupSuccess;
    constructor(public groupId: string, public payload: any) { }
}

export class LoadTeamsByGroupFail implements Action {
    readonly type = TeamActionTypes.getTeamsByGroupFail;
    constructor(public payload: any) { }
}

export class UpdateCurrentTeamsSuccess implements Action {
    readonly type = TeamActionTypes.updateCurrentTeamsSuccess;
    constructor(public groupId: string, public payload: any) { }
}

export class ResetCurrentTeam implements Action {
    readonly type = TeamActionTypes.resetCurrentTeam;
}

export type TeamActions =
    | LoadTeamsByGroup
    | LoadTeamsByGroupSuccess
    | LoadTeamsByGroupFail
    | UpdateCurrentTeamsSuccess
    | ResetCurrentTeam;
