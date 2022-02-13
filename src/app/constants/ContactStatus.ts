export enum ContactStatus {
    WatingToConfirm = 1,
    Completed = 2,
    Fail = 3
}

export const CONTACT_STATUS_COLOR = {
    [ContactStatus.WatingToConfirm]: 'cyan',
    [ContactStatus.Completed]: 'green',
    [ContactStatus.Fail]: 'red'
};