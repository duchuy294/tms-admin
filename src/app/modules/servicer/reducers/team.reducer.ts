import * as teamActions from '../actions/team.action';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { TeamServicerPage } from '../models/team-servicer/team-servicer.model';

export interface TeamState {
    data: PagingModel<TeamServicerPage>;
    loading: boolean;
    teamsByGroup: any;
    currentTeams: any[];
}

export const initialState: TeamState = {
    data: new PagingModel<TeamServicerPage>(),
    teamsByGroup: {},
    loading: false,
    currentTeams: []
};

export function reducer(
    state = initialState,
    action: teamActions.TeamActions
) {
    switch (action.type) {
        case teamActions.TeamActionTypes.getTeamsByGroup:
            return {
              ...state,
              loading: true
            };
        case teamActions.TeamActionTypes.getTeamsByGroupSuccess:        
          return {
            ...state,
            teamsByGroup: { 
              ...state.teamsByGroup,
              [action.groupId]: action.payload.data
            },
            currentTeams: action.payload.data
          };
        case teamActions.TeamActionTypes.getTeamsByGroupFail:
          return {
            ...state,
            loading: false
          };
        case teamActions.TeamActionTypes.updateCurrentTeamsSuccess:
          return {
            ...state,
            currentTeams: [...state.teamsByGroup[action.groupId]]
          };
        case teamActions.TeamActionTypes.resetCurrentTeam:
          return {
            ...state,
            currentTeams: []
          };
    }
    return state;
}

export const getTeamData = (state: TeamState) => state.data;
export const getTeamLoading = (state: TeamState) => state.loading;
