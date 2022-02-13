export enum StatusType {
    User,
    Order
}

export class FilterDetail {
    fromDate?: string;
    toDate?: string;
    status?: string;
}
