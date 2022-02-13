import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { CustomerServiceObservable } from '@/modules/customer/services/customer.service.observable';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { QueryModel } from '@/models/query.model';
import { ServicerServiceObservable } from '@/modules/servicer/services/servicer.service.observable';
import { UserStatus } from '../../../constants/UserStatus';
import { ServicerService } from '@/modules/servicer/services/servicer.service';

@Component({
    selector: 'search-and-suggest-account-component',
    templateUrl: './search-and-suggest-account-component.component.html'
})
export class SearchAndSuggestAccountComponentComponent
    implements OnInit, OnChanges {
    @Input() autoSuggestField: string = null;
    @Input() allowCustomer: boolean = false;
    @Input() allowServicer: boolean = false;
    @Input() mode: string = 'default';
    @Input() ngModel = null;
    @Input() selectedId = null;
    @Output() ngModelChange = new EventEmitter();
    @Input() placeHolder: string = '';
    @Input() valueType: string = null;
    @Input() disabled: boolean = false;
    @Input() duplicated: boolean = false;
    @Input() customerSearchCondition = {
        status: `${UserStatus.NEW},${UserStatus.ACTIVE}`
    };
    @Input() servicerSearchCondition = {
        status: `${UserStatus.NEW},${UserStatus.ACTIVE}`
    };

    @Input() firstOption: boolean = false;
    @Input() firstOptionData = {};

    accountType: string = 'user';
    isSearching: boolean = false;
    searchChange$ = new BehaviorSubject({
        term: '',
        accountType: this.accountType
    });
    accountOptionList = [];
    subscription: Subscription;
    servicersGroup = {};
    get model() {
        return this.ngModel;
    }

    set model(value) {
        if (this.mode === 'default') {
            this.ngModel = value;
        } else {
            this.ngModel = this.duplicated
                ? value
                : _.uniqWith(value, _.isEqual);
        }
        this.ngModelChange.emit(this.ngModel);
    }

    selectValue($event) {
        return this.valueType ? $event[this.valueType] : $event;
    }

    constructor(
        private customerServiceObservable: CustomerServiceObservable,
        private servicerServiceObservable: ServicerServiceObservable,
        private servicerService: ServicerService
    ) {}

    async ngOnInit() {
        const servicers = await this.servicerService.getGroupServicers(
            new QueryModel({ limit: 1000 })
        );
        this.servicersGroup = _.groupBy(servicers.data, item => item._id);
        if (this.selectedId) {
            this.ngModel = this.selectedId;
            this.onSearchAccount(null);
        } else {
            this.onSearchAccount(this.ngModel);
        }
        this.getAccountOptionList();
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.allowCustomer || changes.allowServicer) {
            if (this.subscription) {
                this.subscription.unsubscribe();
                this.getAccountOptionList();
            }
        }
    }

    onSearchAccount($event) {
        this.isSearching = true;
        this.searchChange$.next({
            term: $event,
            accountType: this.accountType
        });
    }

    getAccountOptionList() {
        if (this.allowCustomer && this.allowServicer) {
            this.getCustomerAndServicer();
        } else if (this.allowCustomer) {
            this.getCustomer();
        } else if (this.allowServicer) {
            this.getServicer();
        }
    }

    getCustomerAndServicer() {
        const getCustomerList = ({ term }) => {
            return this.customerServiceObservable
                .getCustomers(
                    new QueryModel({
                        ...this.customerSearchCondition,
                        autoSuggest: term,
                        autoSuggestField: this.autoSuggestField
                    })
                )
                .pipe(
                    map((res: any) => {
                        const customers = this.allowCustomer
                            ? res.data.data.map(item => ({
                                  ...item,
                                  userType: 'user'
                              }))
                            : [];
                        return { customers, term };
                    })
                );
        };

        const getServicerList = ({ term, customers }) => {
            return this.servicerServiceObservable
                .getServicers(
                    new QueryModel({
                        ...this.servicerSearchCondition,
                        autoSuggest: term,
                        autoSuggestField: this.autoSuggestField
                    })
                )
                .pipe(
                    map((res: any) => {
                        const servicers = this.allowServicer
                            ? res.data.data.map(item => ({
                                  ...item,
                                  userType: 'servicer'
                              }))
                            : [];
                        return [...servicers, ...customers];
                    })
                );
        };

        const accountOptionList$: Observable<string[]> = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getCustomerList))
            .pipe(switchMap(getServicerList));
        this.subscription = accountOptionList$.subscribe(data => {
            this.accountOptionList = data;
            this.isSearching = false;
        });
    }

    getCustomer() {
        const getCustomerList = ({ term }) => {
            return this.customerServiceObservable
                .getCustomers(
                    new QueryModel({
                        ...this.customerSearchCondition,
                        autoSuggest: term,
                        autoSuggestField: this.autoSuggestField,
                        userIds: this.selectedId
                    })
                )
                .pipe(
                    map((res: any) => {
                        const customers = res.data.data.map(item => ({
                            ...item,
                            userType: 'user'
                        }));
                        return customers;
                    })
                );
        };
        const customerOptionList$ = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getCustomerList));
        this.subscription = customerOptionList$.subscribe(data => {
            this.accountOptionList = data;
            this.isSearching = false;
            this.selectedId = null;
        });
    }

    getServicer() {
        const getServicerList = ({ term }) => {
            return this.servicerServiceObservable
                .getServicers(
                    new QueryModel({
                        ...this.servicerSearchCondition,
                        servicerIds: this.selectedId,
                        autoSuggest: term,
                        autoSuggestField: this.autoSuggestField
                    })
                )
                .pipe(
                    map((res: any) => {
                        const servicers = res.data.data.map(item => ({
                            ...item,
                            userType: 'servicer'
                        }));
                        return servicers;
                    })
                );
        };
        const servicerOptionList$ = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getServicerList));
        this.subscription = servicerOptionList$.subscribe(data => {
            this.selectedId = null;
            this.accountOptionList = data;
            this.isSearching = false;
        });
    }

    getGroup(item) {
        if (item.type === 2) {
            return item.servicerGroupId &&
                this.servicersGroup[item.servicerGroupId]
                ? `- ${this.servicersGroup[item.servicerGroupId][0].name}`
                : '';
        }
        if (item.type === 1) {
            return item.groupId && this.servicersGroup[item.groupId]
                ? `- ${this.servicersGroup[item.groupId][0].name}`
                : '';
        }
        return '';
    }
}
