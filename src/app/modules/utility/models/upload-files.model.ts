import { BaseModel } from 'app/models/BaseModel';

export class UploadFilesModel extends BaseModel {
    files: string[];
    path: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
