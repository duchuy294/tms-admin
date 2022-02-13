import * as _ from 'lodash';

export abstract class BaseModel {
    _id?: string;
    createdAt?: number;
    updatedAt?: number;

    constructor(item = null) {
        this.mapFields(item);
    }

    omitFields() {
        return [];
    }

    public mapFields(item) {
        if (item) {
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    this[key] = item[key];
                }
            }
        }
    }
}

export class BaseNameModel extends BaseModel {
    fullName: string = '';
    code: string;
    lang: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }

    public omitFields() {
        return super.omitFields().concat(['fullName']);
    }
}
