import {
    Component,
    EventEmitter,
    Input,
    Output
    } from '@angular/core';
import { FilterSettingModel, FilterSettingType } from './filter.model';

@Component({
    selector: 'filter-settings',
    templateUrl: './filter.component.html'
})
export class FilterComponent {
    @Input() display: boolean;
    @Input() type: FilterSettingType = FilterSettingType.Admin;
    @Output() search = new EventEmitter<FilterSettingModel>();

    public model = new FilterSettingModel();

    searchEvent() {
        this.search.emit(this.model);
        this.display = false;
    }
}
