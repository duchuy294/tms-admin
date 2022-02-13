import * as dashboardActions from '../actions/dashboard-statistics.actions';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { DashboardStatisticsModel } from '../models/dashboard-statistics.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionDebtModel } from '../models/collection-debt.model';
import { OrdersModel } from '../models/orders-model';
import { ServicerModel } from '../models/servicer-model';

export interface DashboardStatisticsState {
  data: DashboardStatisticsModel;
  totalCollectionFeeList: PagingModel<CollectionDebtModel>;
  ordersList: PagingModel<OrdersModel>;
  loading: boolean;
  loadingCollectionFee: boolean;
  loadingOrders: boolean;
  servicersData: ServicerModel[];
  servicersDataOnMap: ServicerModel[];
  hasMoreServicer: boolean;
  loadingServicer: boolean;
  loadingServicerOnMap: boolean;
}

export const initialState: DashboardStatisticsState = {
  data: new DashboardStatisticsModel(),
  totalCollectionFeeList: new PagingModel<CollectionDebtModel>(),
  ordersList: new PagingModel<OrdersModel>(),
  loading: false,
  loadingCollectionFee: false,
  loadingOrders: false,
  servicersData: [],
  servicersDataOnMap: [],
  hasMoreServicer: false,
  loadingServicer: false,
  loadingServicerOnMap: false
};

export function reducer(
  state = initialState,
  action: dashboardActions.DashboardActions
) {
  let dataChange = {};
  switch (action.type) {
    case dashboardActions.DashboardStatisticsActionTypes.getStatistics:
      return {
        ...state,
        loading: true
      };
    case dashboardActions.DashboardStatisticsActionTypes.getStatisticsSuccess:
      return {
        ...state,
        data: action.payload.data,
        loading: false
      };
    case dashboardActions.DashboardStatisticsActionTypes.getStatisticsFail:
      return {
        ...state,
        loading: false
      };
    case dashboardActions.DashboardStatisticsActionTypes.getTotalCollectionFeeList:
      return {
        ...state,
        loadingCollectionFee: true
      };
    case dashboardActions.DashboardStatisticsActionTypes.getTotalCollectionFeeListSuccess:
      return {
        ...state,
        totalCollectionFeeList: action.payload,
        loadingCollectionFee: false
      };
    case dashboardActions.DashboardStatisticsActionTypes.getTotalCollectionFeeListFail:
      return {
        ...state,
        loadingCollectionFee: false
      };
    case dashboardActions.DashboardStatisticsActionTypes.getTotalOrdersList:
      if (action.payload.page === 1) {
        dataChange = {
          ordersList: new PagingModel<OrdersModel>()
        };
      }
      return {
        ...state,
        ...dataChange,
        loadingOrders: true
      };
    case dashboardActions.DashboardStatisticsActionTypes.getTotalOrdersListSuccess:
      return {
        ...state,
        ordersList: action.payload,
        loadingOrders: false
      };
    case dashboardActions.DashboardStatisticsActionTypes.getTotalOrdersListFail:
      return {
        ...state,
        loadingOrders: false
      };
    case dashboardActions.DashboardStatisticsActionTypes.getServicers:
      return {
        ...state,
        servicersData: action.loadFirst ? [] : [...state.servicersData],
        loadingServicer: true
      };
    case dashboardActions.DashboardStatisticsActionTypes.getServicersSuccess:
      return {
        ...state,
        servicersData: [...state.servicersData, ...action.payload.data],
        hasMoreServicer: action.payload.page < Math.ceil(action.payload.total / action.payload.limit),
        loadingServicer: false
      };
    case dashboardActions.DashboardStatisticsActionTypes.getServicersFail:
      return {
        ...state,
        loadingServicer: false
      };
  }
  return state;
}

export const getReportState = createFeatureSelector<DashboardStatisticsState>(
  'report'
);
export const selectStatisticData = createSelector(getReportState, (state: DashboardStatisticsState) => state.data);
export const selectStatisticLoading = createSelector(getReportState, (state: DashboardStatisticsState) => state.loading);
export const selectTotalCollectionDebt = createSelector(getReportState, (state: DashboardStatisticsState) => state.totalCollectionFeeList);
export const selectTotalCollectionDebtLoading = createSelector(getReportState, (state: DashboardStatisticsState) => state.loadingCollectionFee);
export const selectOrdersLoading = createSelector(getReportState, (state: DashboardStatisticsState) => state.loadingOrders);
export const selectOrdersList = createSelector(getReportState, (state: DashboardStatisticsState) => state.ordersList);
export const selectServicerLoading = createSelector(getReportState, (state: DashboardStatisticsState) => state.loadingServicer);
export const selectServicerData = createSelector(getReportState, (state: DashboardStatisticsState) => state.servicersData);
export const selectServicerLoadingOnMap = createSelector(getReportState, (state: DashboardStatisticsState) => state.loadingServicerOnMap);
export const selectServicerDataOnMap = createSelector(getReportState, (state: DashboardStatisticsState) => state.servicersDataOnMap);
export const selectServicerHasMore = createSelector(getReportState, (state: DashboardStatisticsState) => state.hasMoreServicer);