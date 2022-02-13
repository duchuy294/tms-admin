import { QueryModel } from 'app/models/query.model';

export class LocationQueryModel extends QueryModel {
    bounds: string;
    state?: boolean;
    cityId?: string;
}