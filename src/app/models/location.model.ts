import { BaseModel } from 'app/models/BaseModel';

export class LocationModel extends BaseModel {
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
    type?: string;
    address?: string;
    coordinates?: number[] = [];
}
