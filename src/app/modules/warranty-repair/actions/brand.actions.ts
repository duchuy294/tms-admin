import { Action } from '@ngrx/store';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { BrandModel } from '../models/brand.model';

export enum BrandActionTypes {
    getBrands = '[Brand] Load Brands',
    getBrandsSuccess = '[Brand] Load Brands Success',
    getBrandsFail = '[Brand] Load Brands Fail'
}

export class LoadBrands implements Action {
  readonly type = BrandActionTypes.getBrands;
  constructor(public query: QueryModel) {}
}

export class LoadBrandsSuccess implements Action {
    readonly type = BrandActionTypes.getBrandsSuccess;
    constructor(public payload: PagingModel<BrandModel>) {}
}

export class LoadBrandsFail implements Action {
    readonly type = BrandActionTypes.getBrandsFail;
    constructor(public payload: any) {}
}

export type BrandAction = LoadBrands | LoadBrandsSuccess | LoadBrandsFail;