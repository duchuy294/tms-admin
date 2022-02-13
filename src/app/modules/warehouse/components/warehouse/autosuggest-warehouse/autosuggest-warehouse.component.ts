import * as _ from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { QueryModel } from '@/models/query.model';
import { WarehouseServiceObservable } from '@/modules/warehouse/services/warehouse.service.observable';

@Component({
    selector: 'autosuggest-warehouse',
    templateUrl: './autosuggest-warehouse.component.html'
})
export class AutosuggestWarehouseComponent implements OnInit {
    @Input() autosuggestField: string = null;
    @Input() mode: string = 'default';
    @Input() valueType: string = null;
    @Input() disabled: boolean = false;
    @Input() duplicated: boolean = false;
    @Input() searchCondition = {};
    @Input() model: any;
    @Output() modelChange = new EventEmitter();

    get _model() {
        return this.model;
    }

    set _model(value) {
        if (this.mode === 'default') {
            this.model = value;
        } else {
            this.model = this.duplicated ? value : _.uniqWith(value, _.isEqual);
        }
        this.modelChange.emit(this.model);
    }

    isSearching: boolean = false;
    searchChange$ = new BehaviorSubject({ term: '' });
    warehouseList = [];
    subscription: Subscription;

    constructor(private warehouseServiceObservable: WarehouseServiceObservable) { }

    ngOnInit() {
        if (this.model) {
            this.onSearch(this.model);
        }
        this.getWarehouseList();
    }

    selectValue($event) {
        return this.valueType ? $event[this.valueType] : $event;
    }

    onSearch($event) {
        this.isSearching = true;
        this.searchChange$.next({ term: $event });
    }

    getWarehouseList() {
        const getWarehouseList = ({ term }) => {
            return this.warehouseServiceObservable.getWarehouses(new QueryModel({
                ...this.searchCondition,
                autosuggest: term,
                autosuggestField: this.autosuggestField
            })).pipe(
                map((res: any) => {
                    const warehouses = res.data.data.map(item => ({ ...item }));
                    return warehouses;
                })
            );
        };
        const warehouseOptionList$ = this.searchChange$.asObservable()
            .pipe(debounceTime(500))
            .pipe(
                switchMap(getWarehouseList));
        this.subscription = warehouseOptionList$.subscribe(data => {
            this.warehouseList = data;
            this.isSearching = false;
        });
    }
}