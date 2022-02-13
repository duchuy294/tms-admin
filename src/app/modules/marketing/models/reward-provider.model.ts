import { BaseModel } from 'app/models/BaseModel';
import { Status } from 'app/constants/status.enum';

export class RewardProviderModel extends BaseModel {
    name?: string;
    code?: string;
    images: string[] = [];
    image?: string;
    description?: string;
    content?: string;
    status = Status.ACTIVE;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}