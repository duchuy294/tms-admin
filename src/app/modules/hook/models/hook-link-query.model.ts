import { QueryModel } from '@/models/query.model';

export class HookLinkQueryModel extends QueryModel {
    types?: string;
    user?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}