import { ActionEvent } from '@/services/event.bus.service';

export enum NotificationActionTypes {
  receiveNotification = '[Notification] Receive notification',
  receiveNotificationSuccess = '[Notification] Receive notification success',
  receiveNotificationFail = '[Notification] Receive notification fail',
  receiveMessengerNotification = '[Notification] Receive messenger notification',
  seenNotification = '[Notification] Seen'
}

export class ReceiveNotification implements ActionEvent {
  readonly type = NotificationActionTypes.receiveNotification;
  constructor(public payload?: any) { }
}

export class ReceiveNotificationSuccess implements ActionEvent {
  readonly type = NotificationActionTypes.receiveNotificationSuccess;
  constructor(public payload: any) { }
}

export class ReceiveNotificationFail implements ActionEvent {
  readonly type = NotificationActionTypes.receiveNotificationFail;
  constructor(public payload: any) { }
}

export class ReceiveMessengerNotification implements ActionEvent {
  readonly type = NotificationActionTypes.receiveMessengerNotification;
  constructor(public payload?: any) { }
}

export class SeenNotification implements ActionEvent {
  readonly type = NotificationActionTypes.seenNotification;
}

export type NotificationAction = ReceiveNotification | ReceiveNotificationSuccess | ReceiveNotificationFail;