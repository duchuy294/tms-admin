export enum PointStatus {
    PICKUP_FAILED = -3,
    INSTALLATION_FAILED = - 2,
    DELIVERY_FAILED = - 1,
    NEW = 0,
    DELIVERED = 1,
    INSTALLED = 2,
    DELTED = 3,
    SKIP = 4,
    PROBLEM = 5,
    CONFIRM_FIX_PROBLEM = 6,
    FIXED = 7,
    ARRIVED = 8,
    RETURNED = 9,
    RETURN_FAILED = 10,
    PICKUP_SUCCESSFUL = 11,
    ACCEPTED_QUOTATION = 12,
    RETURN = 13,
    SCHEDULED = 14,
    SENT_QUOTATION = 15,
    COMPLETED = 16,
    FAILED = 17,
    IN_PROCESSING = 19,
    COMPLETE_LATER = 20,
    PENDING = 21,
}

export const POINT_STATUS_COLOR = ['#000000', '#014AD7', '#FFDB01', '#090B56', '#409212', '#882498', '#00717E', '#F67380', '#01539F',
    '#F97706', '#B07EB8', '#105402', '#780001', '#021FC1', '#B5DC8C', '#F364B6', '#F5AA39', '#B88607', '#62C9CD', '#6006A5'];