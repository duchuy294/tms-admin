import { BehaviorSubject, Subscription } from 'rxjs';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
    } from '@angular/core';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { QueryModel } from '@/models/query.model';
import { RewardServiceObservable } from '../../../services/reward.service.observable';
import { Status } from '@/constants/status.enum';
@Component({
    selector: 'reward-search',
    templateUrl: './reward-search.component.html'
})
export class RewardSearchComponent implements OnInit {
    @Input() autosuggestField: string = null;
    @Input() ngModel = null;
    @Input() placeHolder: string = '';
    @Input() valueType: string = null;
    @Input() condition = new QueryModel({ status: Status.ACTIVE });
    @Input() disabled = false;

    @Output() ngModelChange = new EventEmitter();

    isSearching: boolean = false;
    searchChange$ = new BehaviorSubject({ term: '' });
    rewardList = [];
    subscription: Subscription;

    get model() {
        return this.ngModel;
    }

    set model(value) {
        this.ngModel = value;
        this.ngModelChange.emit(value);
    }

    selectValue($event) {
        return this.valueType ? $event[this.valueType] : $event;
    }

    constructor(
        private rewardServiceObservable: RewardServiceObservable
    ) { }

    async ngOnInit() {
        if (this.ngModel) {
            this.onSearch(this.ngModel);
        }
        this.getReward();
    }

    onSearch($event) {
        this.isSearching = true;
        this.searchChange$.next({ term: $event });
    }

    getReward() {
        const getRewardList = ({ term }) => {
            return this.rewardServiceObservable.filter(new QueryModel({
                ...this.condition,
                name: term
            })).pipe(
                map((res: any) => {
                    const servicers = res.data.data.map(item => ({ ...item, userType: 'servicer' }));
                    return servicers;
                })
            );
        };
        const rewardList$ = this.searchChange$.asObservable()
            .pipe(debounceTime(500))
            .pipe(
                switchMap(getRewardList));
        this.subscription = rewardList$.subscribe(data => {
            this.rewardList = data;
            this.isSearching = false;
        });
    }
}
