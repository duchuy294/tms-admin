import { QueryModel } from '@/models/query.model';

export class CustomerQueryModel extends QueryModel {
    userIds: string;
    type?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}