import { StoreModel } from '../models/store.model';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { StoreAction, StoreActionTypes } from '../actions/store.actions';

export interface StoreState {
    stores: PagingModel<StoreModel>;
    current: StoreModel;
    loading: boolean;
    created: string;
    updated: string;
    deleted: string;
}

export const initialState: StoreState = {
    stores: new PagingModel<StoreModel>(),
    current: new StoreModel(),
    loading: false,
    updated: 'idle',
    created: 'idle',
    deleted: 'idle'
};

export function reducer(state = initialState, action: StoreAction) {
    switch (action.type) {
        case StoreActionTypes.getStores:
            return {
                ...state,
                loading: true
            };
        case StoreActionTypes.editStore:
            return {
                ...state,
                updated: 'start'
            };
        case StoreActionTypes.addStore:
            return {
                ...state,
                loading: true,
                created: 'start'
            };
        case StoreActionTypes.getStoresSuccess:
            return {
                ...state,
                stores: action.payload,
                loading: false
            };
        case StoreActionTypes.editStoreSuccess:
            return {
                ...state,
                loading: false,
                updated: 'success'
            };
        case StoreActionTypes.addStoreSuccess:
            return {
                ...state,
                loading: false,
                created: 'success'
            };
        case StoreActionTypes.getStoresFail:
        case StoreActionTypes.editStoreFail:
            return {
                ...state,
                loading: false,
                updated: 'error'
            };
        case StoreActionTypes.addStoreFail: 
            return {
                ...state,
                created: 'error'
            };
        case StoreActionTypes.deleteStore:
            return {
                ...state,
                deleted: 'start'
            };
        case StoreActionTypes.deleteStoreSuccess: 
            return {
                ...state,
                deleted: 'success'
            };
        case StoreActionTypes.deleteStoreFail: 
            return {
                ...state,
                deleted: 'error'
            };
    }
    return state;
}
