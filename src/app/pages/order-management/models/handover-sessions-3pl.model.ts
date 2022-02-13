import { BaseModel } from 'app/models/BaseModel';

export class HandoverSessions3PLModel extends BaseModel {
    code?: string;
    externalCode?: string;
    reason?: string;
    userId?: string;
    clientBranchId?: string;
    processedBy?: string;
    confirmedBy?: string;
    status?: number;
    completed?: number;
    packageQuantity?: number;
    saleOrderQuantity?: number;
    package?: any[];
    packages?: any[];
    saleOrders?: any[];
}
export class HandoverScan3PLModel extends BaseModel {
    package?: string;
    SO?: string;
    valid?: boolean;
    clientBranch?: any;
    message?: any;
}

export enum HandoverSessions3PLStatus {
    new = 1,
    adminConfirm = 2,
    completed = 3,
    cancel = 4,
    partConfirm = 5,
    partCompleted = 6
}

export const HandoverSessions3PL = {
    [HandoverSessions3PLStatus.new]: { name: 'new', color: '#333333' },
    [HandoverSessions3PLStatus.adminConfirm]: {
        name: 'adminConfirm',
        color: '#226502'
    },
    [HandoverSessions3PLStatus.completed]: {
        name: 'completed',
        color: '#52c41a'
    },
    [HandoverSessions3PLStatus.cancel]: {
        name: 'cancel',
        color: '#F00'
    },
    [HandoverSessions3PLStatus.partConfirm]: {
        name: 'partConfirm',
        color: '#0697b7'
    },
    [HandoverSessions3PLStatus.partCompleted]: {
        name: 'partCompleted',
        color: '#faad14'
    }
};
