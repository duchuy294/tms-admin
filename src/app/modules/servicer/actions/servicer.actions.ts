import { Action } from '@ngrx/store';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { GroupServicer } from '../models/group-servicer/group-servicer.model';

export enum ServicerActionTypes {
    getServicers = '[Servicer] Load Servicers',
    getServicersSuccess = '[Servicer] Load Servicers Success',
    getServicersFail = '[Servicer] Load Servicers Fail'
}

export enum ServicerGroupActionTypes {
    getGroupServicers = '[Servicer Group] Get Group Servicer',
    getGroupServicersSuccess = '[Servicer Group] Get Group Servicer Success',
    getGroupServicersFail = '[Servicer Group] Get Group Servicer Fail',

    updateCurrentGroup = '[Servicer Group] Update Current Group'
}

export enum TotalServicerActionTypes {
    getTotalServicersState = '[Servicer State] Get Total Servicers State',
    getTotalServicersStateSuccess = '[Servicer State] Get Total Servicers State Success',
    getTotalServicersStateFail = '[Servicer State] Get Total Servicers State Fail',
}

export class LoadServicer implements Action {
    readonly type = ServicerActionTypes.getServicers;
    constructor(public payload: any) {}
}

export class LoadServicersSuccess implements Action {
    readonly type = ServicerActionTypes.getServicersSuccess;
    constructor(public payload: any) {}
}

export class LoadServicersFail implements Action {
    readonly type = ServicerActionTypes.getServicersFail;
    constructor(public payload: any) {}
}

export class LoadGroupServicers implements Action {
    readonly type = ServicerGroupActionTypes.getGroupServicers;
    constructor(public payload: any) {}
}

export class LoadGroupServicersSuccess implements Action {
    readonly type = ServicerGroupActionTypes.getGroupServicersSuccess;
    constructor(public payload: PagingModel<GroupServicer>) {}
}

export class LoadGroupServicersFail implements Action {
    readonly type = ServicerGroupActionTypes.getGroupServicersFail;
    constructor(public payload: any) {}
}

export class LoadTotalServicersState implements Action {
    readonly type = TotalServicerActionTypes.getTotalServicersState;
    constructor(public payload: any) {}
}

export class LoadTotalServicersStateSuccess implements Action {
    readonly type = TotalServicerActionTypes.getTotalServicersStateSuccess;
    constructor(public payload: any) {}
}

export class LoadTotalServicersStateFail implements Action {
    readonly type = TotalServicerActionTypes.getTotalServicersStateFail;
    constructor(public payload: any) {}
}

export class UpdateCurrentGroup implements Action {
    readonly type = ServicerGroupActionTypes.updateCurrentGroup;
    constructor(public payload: any) {}
}


export type ServicerActions =
    | LoadServicer
    | LoadServicersSuccess
    | LoadServicersFail
    | LoadGroupServicers
    | LoadGroupServicersSuccess
    | LoadGroupServicersFail
    | LoadTotalServicersState
    | LoadTotalServicersStateSuccess
    | LoadTotalServicersStateFail
    | UpdateCurrentGroup;
