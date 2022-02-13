import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBrand from './brand.reducer';
import * as fromStore from './store.reducer';

export interface WarrantyRepairState {
    brand: fromBrand.BrandState;
    store: fromStore.StoreState;
}

export const reducers: ActionReducerMap<WarrantyRepairState> = {
    brand: fromBrand.reducer,
    store: fromStore.reducer
};

export const getWarrantysState = createFeatureSelector<WarrantyRepairState>(
    'warranty'
);

export const getStoresState = createSelector(getWarrantysState, state => state.store);
export const getBrandsState = createSelector(getWarrantysState, state => state.brand);

export const getUpdatedStoreSelector = createSelector(getStoresState, (store => store.updated));
export const getDeletedStoreSelector = createSelector(getStoresState, (store => store.deleted));