import { ActionEvent } from '@/services/event.bus.service';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationActionTypes } from '../actions/notitication.actions';

export interface NotificationState {
  notifications: any;
  newNotificationCount: number;
}

export const initialState: NotificationState = {
  notifications: {},
  newNotificationCount: 0
};


const NOTIFICATION_MAPPER = {
  'order': 'notice',
  'incidentOrder': 'notice',
  'response': 'notice',
  'wallet': 'notice'
};

export function reducer(
  state = initialState,
  action: ActionEvent
) {
  const payload = action.payload;
  switch (action.type) {
    case NotificationActionTypes.receiveNotificationSuccess:
      const notificationType = NOTIFICATION_MAPPER[payload.notificationType] || payload.notificationType;
      return {
        ...state,
        newNotificationCount: state.newNotificationCount + 1,
        notifications: {
          ...state.notifications,
          [notificationType]: [
            ...(state.notifications[notificationType] || []),
            {
              ...payload,
              createdAt: new Date()
            }
          ]
        }
      };
  }
  return state;
}

export const getNotificationState = createFeatureSelector<NotificationState>(
  'notification'
);

export const getNewNotificationCount = createSelector(getNotificationState, state => state.newNotificationCount);
export const getOrderNotification = createSelector(getNotificationState, state => state.notifications['order'] || []);
export const getResponseNotification = createSelector(getNotificationState, state => (state.notifications['response'] || []).reverse());
export const getMessengerNotification = createSelector(getNotificationState, state => (state.notifications['messenger'] || []).reverse());
export const getWalletNotification = createSelector(getNotificationState, state => (state.notifications['wallet'] || []).reverse());
export const getNoticeNotification = createSelector(getNotificationState, state => (state.notifications['notice'] || []).reverse());