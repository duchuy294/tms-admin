import { Operator } from './ConditionOperator';

export const CONDITION = {
    'promotionCode': [
        'userLevelId',
        'userId',
        'orderType',
        'location',
        'dayPeriod',
        'service',
        'paymentMethod',
        'baseUserCost',
        'createdAt',
        'limitedQuantityByDayAndUser',
        'limitedQuantityByWeekAndUser',
        'limitedQuantityByMonthAndUser',
        'limitedQuantityByUser',
        'limitedQuantityByDay',
        'limitedQuantityByWeek',
        'limitedQuantityByMonth'
    ],
    'customerTopUp': [
        'userLevelId',
        'depositAmount',
        'depositTime',
        'createdAt'
    ],
    'bonusForCustomer': [
        'userLevelId',
        'orderType',
        'baseUserCost',
        'createdAt'
    ],
    'partnerTopUp': [
        'createdAt',
        'depositAmount',
        'depositTime'
    ],
    'bonusForPartnerBasedOnOrder': [
        'orderType',
        'createdAt',
        'servicerCost',
        'servicerRating',
        'createdAt',
        'numberOfOrder',
        'numberOfWorkingDay',
        'incomeAmount'
    ],
    'priceForm': [
        'userLevelId',
        'userId'
    ],
    'loyaltyPolicyPoint': [
        'userLevelId',
        'userId',
        'orderType'
    ],
    'displayReward': [
        'userLevelId',
        'location',
        'displayedAt',
        'limitedQuantityByDayAndUser',
        'limitedQuantityByWeekAndUser',
        'limitedQuantityByMonthAndUser',
        'limitedQuantityByUser',
        'limitedQuantityByDay',
        'limitedQuantityByWeek',
        'limitedQuantityByMonth'
    ],
    'appliedConditionReward': [
        'userLevelId',
        'userId',
        'orderType',
        'location',
        'dayPeriod',
        'service',
        'paymentMethod',
        'baseUserCost'
    ],
};

export const CONDITIONTYPE = {
    userLevelId: {
        typeValue: 'select',
    },
    userId: {
        typeValue: 'input',
    },
    orderType: {
        typeValue: 'select',
    },
    location: {
        typeValue: 'location',
    },
    dayPeriod: {
        typeValue: 'timeRange',
    },
    service: {
        typeValue: 'select',
    },
    paymentMethod: {
        typeValue: 'select',
    },
    baseUserCost: {
        typeValue: 'operator',
        rangeType: 'input',
        unit: 'money',
        dataType: 'number',
    },
    servicerCost: {
        typeValue: 'operator',
        rangeType: 'input',
        unit: 'money',
        dataType: 'number',
    },
    createdAt: {
        typeValue: 'operator',
        rangeType: 'date',
        unit: 'days',
        dataType: 'date'
    },
    displayedAt: {
        typeValue: 'operator',
        rangeType: 'date',
        unit: 'days',
        dataType: 'date'
    },
    depositAmount: {
        typeValue: 'operator',
        rangeType: 'input',
        unit: 'money',
        dataType: 'number',
    },
    depositTime: {
        typeValue: 'operator',
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    servicerRating: {
        typeValue: 'scroll',
        rangeType: 'scroll',
        dataType: 'number',
    },
    numberOfOrder: {
        typeValue: 'operator',
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    numberOfWorkingDay: {
        typeValue: 'operator',
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    incomeAmount: {
        typeValue: 'operator',
        rangeType: 'input',
        unit: 'money',
        dataType: 'number',
    },
    limitedQuantityByDayAndUser: {
        typeValue: 'operator',
        fixedOperator: Operator.LESS_OR_EQUAL,
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    limitedQuantityByWeekAndUser: {
        typeValue: 'operator',
        fixedOperator: Operator.LESS_OR_EQUAL,
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    limitedQuantityByMonthAndUser: {
        typeValue: 'operator',
        fixedOperator: Operator.LESS_OR_EQUAL,
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    limitedQuantityByUser: {
        typeValue: 'operator',
        fixedOperator: Operator.LESS_OR_EQUAL,
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    limitedQuantityByDay: {
        typeValue: 'operator',
        fixedOperator: Operator.LESS_OR_EQUAL,
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    limitedQuantityByWeek: {
        typeValue: 'operator',
        fixedOperator: Operator.LESS_OR_EQUAL,
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    limitedQuantityByMonth: {
        typeValue: 'operator',
        fixedOperator: Operator.LESS_OR_EQUAL,
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    },
    numberOfOrders: {
        typeValue: 'operator',
        fixedOperator: Operator.EQUAL,
        rangeType: 'input',
        unit: 'times',
        dataType: 'number',
    }
};