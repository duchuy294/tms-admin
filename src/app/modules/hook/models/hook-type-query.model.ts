import { QueryModel } from '@/models/query.model';

export class HookTypeQueryModel extends QueryModel {
    type?: string;
    requiredField?: string[] = [];

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}