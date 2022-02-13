import { BrandModel } from '../models/brand.model';
import { PagingModel } from '@/utility/components/paging/paging.model';

export interface BrandState {
    brands: PagingModel<BrandModel>;
    current: BrandModel;
    loading: boolean;
}

export const initialState: BrandState = {
    brands: new PagingModel<BrandModel>(),
    current: new BrandModel(),
    loading: false
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'GET BRANDS':
            return {
                ...state,
                loading: true
            };
    }
    return state;
}

export const getBrandsData = (state: BrandState) => state.brands;
