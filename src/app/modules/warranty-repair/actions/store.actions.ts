import { Action } from '@ngrx/store';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { StoreModel } from '../models/store.model';
import { CreateStore } from '../models/create-store.model';

export enum StoreActionTypes {
    getStores = '[Store] Load Stores',
    getStoresSuccess = '[Store] Load Stores Success',
    getStoresFail = '[Store] Load Stores Fail',

    addStore = '[Store] Add Store',
    addStoreSuccess = '[Store] Add Store Success',
    addStoreFail = '[Store] Add Store Fail',

    editStore = '[Store] Edit Store',
    editStoreSuccess = '[Store] Edit Store Success',
    editStoreFail = '[Store] Edit Store Fail',

    deleteStore = '[Store] Delete Store',
    deleteStoreSuccess = '[Store] Delete Store Success',
    deleteStoreFail = '[Store] Delete Store Fail',
}

export class LoadStores implements Action {
    readonly type = StoreActionTypes.getStores;
    constructor(public payload: QueryModel) {}
}

export class LoadStoresSuccess implements Action {
    readonly type = StoreActionTypes.getStoresSuccess;
    constructor(public payload: PagingModel<StoreModel>) {}
}

export class LoadStoresFail implements Action {
    readonly type = StoreActionTypes.getStoresFail;
    constructor(public payload: any) {}
}

export class AddStore implements Action {
    readonly type = StoreActionTypes.addStore;
    constructor(public payload: CreateStore) {}
}

export class AddStoreSuccess implements Action {
    readonly type = StoreActionTypes.addStoreSuccess;
    constructor(public payload: any) {}
}

export class AddStoreFail implements Action {
    readonly type = StoreActionTypes.addStoreFail;
    constructor(public payload: any) {}
}

export class EditStore implements Action {
    readonly type = StoreActionTypes.editStore;
    constructor(public payload: CreateStore) {}
}

export class EditStoreSuccess implements Action {
    readonly type = StoreActionTypes.editStoreSuccess;
    constructor(public payload: any) {}
}

export class EditStoreFail implements Action {
    readonly type = StoreActionTypes.editStoreFail;
    constructor(public payload: any) {}
}

export class DeleteStore implements Action {
    readonly type = StoreActionTypes.deleteStore;
    constructor(public payload: number) {}
}

export class DeleteStoreSuccess implements Action {
    readonly type = StoreActionTypes.deleteStoreSuccess;
}

export class DeleteStoreFail implements Action {
    readonly type = StoreActionTypes.deleteStoreFail;
}

export type StoreAction =
    | LoadStores
    | LoadStoresSuccess
    | LoadStoresFail
    | AddStore
    | AddStoreSuccess
    | AddStoreFail
    | EditStore
    | EditStoreSuccess
    | EditStoreFail
    | DeleteStore
    | DeleteStoreSuccess
    | DeleteStoreFail;
