import { QueryModel } from '@/models/query.model';

export class EmailAccountQueryModel extends QueryModel {
    type?: string;
    host?: string = '';
    port?: string = '';

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}