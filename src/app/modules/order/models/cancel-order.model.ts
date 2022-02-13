import * as _ from 'lodash';

export class CanceOrderlModel {
    _id?: string;
    externalCode?: string;
    orderCode?: string;
    statusLabel?: string;
    valid = false;

    constructor(item: CanceOrderlModel) {
        _.assignIn(this, item);
    }
}