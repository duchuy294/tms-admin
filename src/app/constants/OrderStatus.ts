export enum OrderStatus {
  Timeout = -1,
  New = 1,
  FindingServicer = 2,
  Accepted = 3,
  CanceledByUser = 4,
  CanceledByServicer = 5,
  CanceledByAdmin = 6,
  InProgress = 7,
  Finished = 8,
  Return = 9,
  Incident = 10,
  ProcessingIncident = 11,
  WatingToConfirm = 12,
  Call = 13,
  ConfirmCompleted = 14,
  CanceledByRenter = 15,
  CanceledByLessor = 16,
  ProcessingTimeout = 17,
  ProcessedTimeout = 18,
  FailedInstallation = 19,
  Pending = 20,
  PendingReturned = 21,
  FinishedWithReturn = 22
}

export enum OrderProgressStatus {
  New = 1,
  Arrived = 2,
  PickedGoods = 3,
  Delivered = 4,
  Installed = 5
}

export const ORDER_STATUS_COLOR = {
  [OrderStatus.ProcessingTimeout]: '',
  [OrderStatus.ProcessedTimeout]: '',
  [OrderStatus.Timeout]: '',
  [OrderStatus.InProgress]: '#2db7f5',
  [OrderStatus.Accepted]: 'blue',
  [OrderStatus.FindingServicer]: 'cyan',
  [OrderStatus.ProcessingIncident]: 'orange',
  [OrderStatus.Finished]: 'green',
  [OrderStatus.CanceledByAdmin]: 'red',
  [OrderStatus.CanceledByServicer]: 'red',
  [OrderStatus.CanceledByUser]: 'red',
  [OrderStatus.Return]: 'purple',
  [OrderStatus.Incident]: 'red',
  [OrderStatus.CanceledByRenter]: 'red',
  [OrderStatus.CanceledByLessor]: 'red',
  [OrderStatus.WatingToConfirm]: 'cyan',
  [OrderStatus.Call]: '',
  [OrderStatus.ConfirmCompleted]: 'blue',
  [OrderStatus.FailedInstallation]: 'red',
  [OrderStatus.Pending]: 'gold',
  [OrderStatus.PendingReturned]: '#ca8807',

};