import { BaseModel } from 'app/models/BaseModel';
export class GridAction extends BaseModel {
    name?: string;
    perform?: (item: any) => void;
    visible?: (item: any) => boolean;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}