import * as _ from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { EndUserServiceObservable } from '@/modules/customer/services/end-user.service.observable';
import { QueryModel } from '@/models/query.model';

@Component({
  selector: 'search-and-suggest-end-user-component',
  templateUrl: './search-and-suggest-end-user-component.component.html'
})
export class SearchAndSuggestEndUserComponentComponent implements OnInit, OnChanges {
  @Input() autoSuggestField: string = null;
  @Input() allowEndUser: boolean = false;
  @Input() allowSubEndUser: boolean = false;
  @Input() mode: string = 'default';
  @Input() ngModel = null;
  @Input() endUserId: string = null;
  @Output() ngModelChange = new EventEmitter();
  @Input() placeHolder: string = '';
  @Input() valueType: string = null;
  @Input() disabled: boolean = false;
  @Input() duplicated: boolean = false;
  @Input() endUserSearchCondition: any = null;
  @Input() subEndUserSearchCondition: any = null;
  @Input() selectedId = null;

  isSearching: boolean = false;
  searchChange$ = new BehaviorSubject({ term: '' });
  accountOptionList = [];
  subscription: Subscription;

  get model() {
    return this.ngModel;
  }

  set model(value) {
    if (this.mode === 'default') {
      this.ngModel = value;
    } else {
      this.ngModel = this.duplicated ? value : _.uniqWith(value, _.isEqual);
    }
    this.ngModelChange.emit(this.ngModel);
  }

  selectValue($event) {
    return this.valueType ? $event[this.valueType] : $event;
  }

  constructor(
    private endUserServiceObservable: EndUserServiceObservable
  ) { }

  async ngOnInit() {
    if (this.selectedId) {
      this.ngModel = this.selectedId;
      this.onSearchAccount(null);
    } else {
      this.onSearchAccount(this.ngModel);
    }
    this.getAccountOptionList();
  }

  async reset() {
    if (this.ngModel) {
      this.onSearchAccount(this.ngModel);
    }
    this.getAccountOptionList();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.allowEndUser || changes.allowSubEndUser) {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.getAccountOptionList();
      }
    }
  }


  onSearchAccount($event) {
    this.isSearching = true;
    this.searchChange$.next({ term: $event });
  }

  getAccountOptionList() {
    if (this.allowEndUser) {
      this.getEndUser();
    } else if (this.allowSubEndUser) {
      this.getSubEndUser();
    }
  }

  getEndUser() {
    const getEndUserList = ({ term }) => {
      return this.endUserServiceObservable.getEndUsers(new QueryModel({
        ...this.endUserSearchCondition,
        autoSuggest: term,
        autoSuggestField: this.autoSuggestField,
        userIds: this.selectedId
      })).pipe(
        map((res: any) => {
          const endusers = res.data.data.map(item => ({ ...item }));
          return endusers;
        })
      );
    };
    const endUserOptionList$ = this.searchChange$.asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap(getEndUserList));
    this.subscription = endUserOptionList$.subscribe(data => {
      this.accountOptionList = data;
      this.isSearching = false;
      this.selectedId = null;
    });
  }

  getSubEndUser() {
    const getSubEndUserList = ({ term }) => {
      return this.endUserServiceObservable.getSubEndUsers(new QueryModel({
        ...this.subEndUserSearchCondition,
        autoSuggest: term,
        autoSuggestField: this.autoSuggestField,
        endUserId: this.endUserId
      })).pipe(
        map((res: any) => {
          const subEndusers = res.data.data.map(item => ({ ...item }));
          return subEndusers;
        })
      );
    };
    const subEndUserOptionList$ = this.searchChange$.asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap(getSubEndUserList));
    this.subscription = subEndUserOptionList$.subscribe(data => {
      this.accountOptionList = data;
      this.isSearching = false;
    });
  }
}
