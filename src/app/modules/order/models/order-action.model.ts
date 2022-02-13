import { GridAction } from 'app/models/grid-action.model';

export class OrderAction extends GridAction {
    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
