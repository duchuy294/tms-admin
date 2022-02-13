import { BaseModel } from 'app/models/BaseModel';
import { ServiceModel } from 'app/modules/price/models/service.model';

export class TeamServicer extends BaseModel {
    code: string;
    name: string;
    status: string;
    services?: TeamService[] = [];
    groupId: string;
    group: { id?: string; name?: string };
    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}

export class TeamServicerPage extends TeamServicer {
    numberOfOrders: number;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }

    public omitFields() {
        return super
            .omitFields()
            .concat(['numberOfOrders', 'numberOfMembers']);
    }
}

export class TeamService extends ServiceModel {
    values?: ServiceValue[] = [];
    selectedValues: string[] = [];
    selectedValue: string;
    from: number = 0;
    to: number = 0;
    isActive?: boolean = false;
}

export class ServiceValue {
    _id: string;
    name?: string;
}
