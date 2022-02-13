export enum SessionCodStatusEnum {
    NOTDELIVERED = 1,
    DELIVERED = 2,
    DELETED = 4,
}

export const SessionCodStatusColor = {
    [SessionCodStatusEnum.NOTDELIVERED]: '#F96E11',
    [SessionCodStatusEnum.DELIVERED]: '#00A527',
    [SessionCodStatusEnum.DELETED]: '#f00',
};
