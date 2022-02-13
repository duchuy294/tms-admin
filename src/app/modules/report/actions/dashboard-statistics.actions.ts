import { Action } from '@ngrx/store';
import { CollectionDebtModel } from '../models/collection-debt.model';
import { PagingModel } from '@/utility/components/paging/paging.model';

export enum DashboardStatisticsActionTypes {
    getStatistics = '[Dashboard] Load Statistics',
    getStatisticsSuccess = '[Dashboard] Load Statistics Success',
    getStatisticsFail = '[Dashboard] Load Statistics Fail',

    getTotalCollectionFeeList = '[Dashboard] Load Total Collection Fee List',
    getTotalCollectionFeeListSuccess = '[Dashboard] Load Total Collection Fee List Success',
    getTotalCollectionFeeListFail = '[Dashboard] Load Total Collection Fee List Fail',

    getTotalOrdersList = '[Dashboard] Load Total Orders List',
    getTotalOrdersListSuccess = '[Dashboard] Load Total Orders List Success',
    getTotalOrdersListFail = '[Dashboard] Load Total Orders List Fail',

    getServicers = '[Dashboard] Load Servicers List',
    getServicersSuccess = '[Dashboard] Load Servicers List Success',
    getServicersFail = '[Dashboard] Load Servicers List Fail',

    getServicersOnMap = '[Dashboard] Load Servicers On Map',
    getServicersOnMapSuccess = '[Dashboard] Load Servicers On Map Success',
    getServicersOnMapFail = '[Dashboard] Load Servicers On Map Fail',
}

export class LoadStatistics implements Action {
    readonly type = DashboardStatisticsActionTypes.getStatistics;
    constructor(public payload: any) { }
}

export class LoadStatisticsSuccess implements Action {
    readonly type = DashboardStatisticsActionTypes.getStatisticsSuccess;
    constructor(public payload: any) { }
}

export class LoadStatisticsFail implements Action {
    readonly type = DashboardStatisticsActionTypes.getStatisticsFail;
    constructor(public payload: any) { }
}

export class GetTotalCollectionFeeList implements Action {
    readonly type = DashboardStatisticsActionTypes.getTotalCollectionFeeList;
    constructor(public payload: any) { }
}

export class GetTotalCollectionFeeListSuccess implements Action {
    readonly type = DashboardStatisticsActionTypes.getTotalCollectionFeeListSuccess;
    constructor(public payload: PagingModel<CollectionDebtModel>) { }
}

export class GetTotalCollectionFeeListFail implements Action {
    readonly type = DashboardStatisticsActionTypes.getTotalCollectionFeeListFail;
    constructor(public payload: any) { }
}


export class GetTotalOrdersList implements Action {
    readonly type = DashboardStatisticsActionTypes.getTotalOrdersList;
    constructor(public payload: any) { }
}

export class GetTotalOrdersListSuccess implements Action {
    readonly type = DashboardStatisticsActionTypes.getTotalOrdersListSuccess;
    constructor(public payload: any) { }
}

export class GetTotalOrdersListFail implements Action {
    readonly type = DashboardStatisticsActionTypes.getTotalOrdersListFail;
    constructor(public payload: any) { }
}


export class GetServicersList implements Action {
    readonly type = DashboardStatisticsActionTypes.getServicers;
    constructor(public payload: any, public loadFirst: boolean = false) { }
}

export class GetServicersListSuccess implements Action {
    readonly type = DashboardStatisticsActionTypes.getServicersSuccess;
    constructor(public payload: any) { }
}

export class GetServicersListFail implements Action {
    readonly type = DashboardStatisticsActionTypes.getServicersFail;
    constructor(public payload: any) { }
}


export class GetServicersListOnMap implements Action {
    readonly type = DashboardStatisticsActionTypes.getServicersOnMap;
    constructor(public payload: any) { }
}

export class GetServicersListOnMapSuccess implements Action {
    readonly type = DashboardStatisticsActionTypes.getServicersOnMapSuccess;
    constructor(public payload: any) { }
}

export class GetServicersListOnMapFail implements Action {
    readonly type = DashboardStatisticsActionTypes.getServicersOnMapFail;
    constructor(public payload: any) { }
}

export type DashboardActions =
    LoadStatistics
    | LoadStatisticsSuccess
    | LoadStatisticsFail
    | GetTotalCollectionFeeList
    | GetTotalCollectionFeeListSuccess
    | GetTotalCollectionFeeListFail
    | GetTotalOrdersList
    | GetTotalOrdersListSuccess
    | GetTotalOrdersListFail
    | GetServicersList
    | GetServicersListSuccess
    | GetServicersListFail
    | GetServicersListOnMap
    | GetServicersListOnMapSuccess
    | GetServicersListOnMapFail;