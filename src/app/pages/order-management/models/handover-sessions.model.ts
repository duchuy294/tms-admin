import { BaseModel } from 'app/models/BaseModel';

export class HandoverSessionsModel extends BaseModel {
    code?: string;
    externalCode?: string;
    reason?: string;
    userId?: string;
    status?: number;
    completed?: number;
    packageQuantity?: number;
    firstScanAt?: string | number;
    lastScanAt?: string | number;
    package?: any[];
    packages?: any[];
}
export class HandoverScanModel extends BaseModel {
    package?: string;
    handoverCode?: string;
    so?: string;
    valid?: boolean;
}

export enum HandoverSessionsStatus {
    new = 1,
    processing = 2,
    completedForce = 3,
    completed = 4,
}

export const HandoverSessions = {
    [HandoverSessionsStatus.new]: { name: 'new', color: '#333333' },
    [HandoverSessionsStatus.processing]: { name: 'processing', color: '#0555DF' },
    [HandoverSessionsStatus.completedForce]: { name: 'completedPart', color: '#FF3D1A' },
    [HandoverSessionsStatus.completed]: { name: 'completed', color: '#45DF05' },
};