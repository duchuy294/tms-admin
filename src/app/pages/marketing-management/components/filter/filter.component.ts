import {
    Component,
    EventEmitter,
    Input,
    Output
    } from '@angular/core';
import { QueryModel } from 'app/models/query.model';

@Component({
    selector: 'filter',
    templateUrl: 'filter.component.html'
})
export class FilterComponent {
    @Output() search = new EventEmitter<QueryModel>();
    @Input() display: boolean = false;
    @Input() hiddens: string[] = [];
    model = new QueryModel();
    types: Selection[] = [];

    searchEvent() {
        this.search.emit(this.model);
    }
}
