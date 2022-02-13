import { mapKeys } from 'lodash';
import * as servicerActions from '../actions/servicer.actions';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { GroupServicer } from '../models/group-servicer/group-servicer.model';

export interface ServicerState {
    datas: string[];
    groups: PagingModel<GroupServicer>;
    groupsQuery: any;
    loading: boolean;
    totalServicersState: any; 
    loadingTotalServicersState: boolean;
    currentGroup: any;
}

export const initialState: ServicerState = {
    datas: [],
    groups: new PagingModel<GroupServicer>(),
    groupsQuery: {},
    loading: false,
    totalServicersState: {},
    loadingTotalServicersState: false,
    currentGroup: {}
};

export function reducer(
    state = initialState,
    action: servicerActions.ServicerActions
) {
    switch (action.type) {
        case servicerActions.ServicerActionTypes.getServicers:
            return {
              ...state,
              loading: true
            };
        case servicerActions.ServicerActionTypes.getServicersSuccess:
          return {
            ...state,
            datas: action.payload.data
          };
        case servicerActions.ServicerGroupActionTypes.getGroupServicersSuccess:
          return {
            ...state,
            groups: action.payload,
            groupsQuery: mapKeys(action.payload.data, '_id')
          };
        case servicerActions.TotalServicerActionTypes.getTotalServicersState:
          return {
            ...state,
            loadingTotalServicersState: true
          };
        case servicerActions.TotalServicerActionTypes.getTotalServicersStateSuccess:
          return {
            ...state,
            totalServicersState: mapKeys(action.payload.data, 'type')
          };
        case servicerActions.TotalServicerActionTypes.getTotalServicersStateFail:
          return {
            ...state,
            loadingTotalServicersState: false
          };
        case servicerActions.ServicerGroupActionTypes.updateCurrentGroup:
          return {
            ...state,
            currentGroup: state.groupsQuery[action.payload]
          };
    }
    return state;
}
