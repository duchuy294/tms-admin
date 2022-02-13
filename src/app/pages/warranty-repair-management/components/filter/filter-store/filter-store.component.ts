import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
    } from '@angular/core';
import { FilterService } from '@/modules/utility/services/filter.service';
import { QueryModel } from '@/models/query.model';
import { Selection } from '@/modules/utility/models/filter.model';
import { Status } from '@/constants/status.enum';
import { StoreQueryModel } from '@/modules/warranty-repair/models/store-query.model';
import { StoreService } from '@/modules/warranty-repair/services/store.service';

@Component({
    selector: 'filter-store',
    templateUrl: './filter-store.component.html',
    styleUrls: ['./filter-store.component.less']
})
export class FilterStoreComponent implements OnInit {
    modelQuery: StoreQueryModel = new StoreQueryModel();
    @Output() modelChange = new EventEmitter();
    @Output() onSearch = new EventEmitter();
    @Output() onReset = new EventEmitter();
    status = [
        Status.NEW,
        Status.ACTIVE,
        Status.SUSPENDED,
        Status.DELETED
    ];
    cities: Selection[] = [];
    districts: Selection[] = [];
    brands: Selection[] = [];
    productTypes: Selection[] = [];

    constructor(
        private filterService: FilterService,
        private storeService: StoreService
    ) { }

    async ngOnInit() {
        this.loadCities();
        this.loadBrands();
        this.loadProductTypes();
    }

    async loadCities() {
        this.cities = await this.filterService.getCities();
    }

    async loadDistricts(city: string) {
        this.modelQuery.district = null;
        this.districts = await this.filterService.getDistricts(city);
    }

    async loadBrands() {
        this.brands = await this.storeService.getBrands(
            new QueryModel({ limit: 1000 })
        );
    }

    async loadProductTypes() {
        this.productTypes = await this.storeService.getProductTypes(
            new QueryModel({ limit: 1000 })
        );
    }

    reset() {
        this.modelQuery = new StoreQueryModel();
        this.modelChange.emit(this.model);
        setTimeout(() => {
            this.onReset.emit();
        }, 100);
    }

    search() {
        this.modelChange.emit(this.model);
        this.onSearch.emit();
    }

    @Input()
    set model(value: any) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }
}
