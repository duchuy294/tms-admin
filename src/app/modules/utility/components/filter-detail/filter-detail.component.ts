import {
    Component,
    EventEmitter,
    Input,
    Output
    } from '@angular/core';
import { FilterDetail, StatusType } from './filter-detail.model';


@Component({
    selector: 'filter-detail',
    templateUrl: 'filter-detail.component.html'
})

export class FilterDetailComponent {
    @Input() type: StatusType = StatusType.User;
    @Output() search = new EventEmitter<FilterDetail>();
    model = new FilterDetail();

    searchEvent() {
        this.search.emit(this.model);
    }
}
