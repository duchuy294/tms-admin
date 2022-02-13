import { BaseModel } from 'app/models/BaseModel';

export class RestrictedTimeoutModel extends BaseModel {
    userId?: string;
    duration = 0;
}
