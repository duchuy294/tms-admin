import { QueryModel } from '@/models/query.model';

export class SmsTemplateQueryModel extends QueryModel {
    type?: string;
    createdBy?: string = '';
    updatedBy?: string = '';

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}