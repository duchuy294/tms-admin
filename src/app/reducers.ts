import * as fromServicer from '@/modules/servicer/reducers/servicer.reducer';
import * as fromNotification from '@/modules/notification/reducers';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    servicer: fromServicer.ServicerState;
    notification: fromNotification.NotificationState;
}

export const reducers: ActionReducerMap<AppState> = {
    servicer: fromServicer.reducer,
    notification: fromNotification.reducer
};