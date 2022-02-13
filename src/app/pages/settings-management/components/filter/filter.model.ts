export enum FilterSettingType {
    Admin,
    OnlineSupport,
    History
}

export class FilterSettingModel {
    startTime: Date;
    endTime: Date;
    name: string;
    group: string;
}
