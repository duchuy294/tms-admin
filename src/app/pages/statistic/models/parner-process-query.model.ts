import { QueryModel } from 'app/models/query.model';

export class PartnerProcessQueryModel extends QueryModel {
    completedFrom: number;
    completedTo: number;
    successRatioFrom: number;
    successRatioTo: number;
    duration: number;
}