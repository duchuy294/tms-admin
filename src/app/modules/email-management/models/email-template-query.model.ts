import { QueryModel } from '@/models/query.model';

export class EmailTemplateQueryModel extends QueryModel {
    type?: string;
    title?: string = '';
    createdBy?: string = '';
    updatedBy?: string = '';

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}