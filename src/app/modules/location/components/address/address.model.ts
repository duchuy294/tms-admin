import { BaseModel } from 'app/models/BaseModel';
export enum LocationLevel {
    REGION = 1,
    CITY = 2,
    DISTRICT = 3,
    WARD = 4,
}
export class FlatLocationModel extends BaseModel {
    name?: string = '';
    code?: string = '';
    parentCode?: string = '';
    nameWithType?: string = '';
    filterByName?: string = '';
    level?: number;
    status?: boolean;
    order?: number;
    matches: string[] = [];
    createdAt?: number;
    createdBy?: string;
    updatedBy?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}

export class AddressModel extends BaseModel {
    street?: string = '';
    cityId?: string = '';
    districtId?: string = '';
    ward?: string = '';
    city?: string = '';
    district?: string = '';
    lat?: number = null;
    lng?: number = null;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}

export class RegionModel extends BaseModel {
    name?: string = '';
    order?: number = 0;
    createdBy?: number;
    updatedBy?: number;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}

export class CityModel extends BaseModel {
    name?: string = '';
    code?: string = '';
    order?: number = 0;
    createdBy?: number;
    updatedBy?: number;
    regionIds?: string[] = [];

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}

export class DistrictModel extends BaseModel {
    _id?: string;
    name?: string;
    code?: string;
    cityId?: string;
    order?: number = 0;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
