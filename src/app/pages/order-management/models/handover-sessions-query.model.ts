import { QueryModel } from 'app/models/query.model';

export class HandoverSessionsQueryModel extends QueryModel {
    firstScanAtFrom: number;
    firstScanAtTo: number;
    lastScanAtFrom: number;
    lastScanAtTo: number;
    soOrPackage: string;
}