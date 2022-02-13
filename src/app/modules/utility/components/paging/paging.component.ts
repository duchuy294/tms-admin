import {
    Component,
    EventEmitter,
    Input,
    Output
    } from '@angular/core';
import { PagingModel } from './paging.model';

@Component({
    selector: 'paging',
    templateUrl: 'paging.component.html'
})

export class PagingComponent<T> {
    @Input() paging: PagingModel<T> = new PagingModel<T>();
    @Output() pageChange = new EventEmitter<PagingModel<T>>();

    change() {
        this.pageChange.emit(this.paging);
    }
}
