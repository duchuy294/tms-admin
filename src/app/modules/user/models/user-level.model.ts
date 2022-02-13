import { BaseModel } from '@/models/BaseModel';

export class UserLevelModel extends BaseModel {
    code?: string;
    minPoint?: number;
    name?: string;
    status?: number;
    content?: string;
    image?: string;
    coverImage?: string;
    default?: boolean;

    constructor(item = null) {
        super(item);
    }
}
