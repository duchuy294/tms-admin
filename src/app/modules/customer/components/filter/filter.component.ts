import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
    } from '@angular/core';
import { QueryModel } from '../../../../models/query.model';
import { Selection } from '../../../../modules/utility/models/filter.model';
import { UserLevelService } from './../../../../modules/user/services/user-level.service';
import { UserType } from '@/constants/UserType';

@Component({
    selector: 'filter',
    templateUrl: 'filter.component.html'
})
export class FilterComponent implements OnInit {
    @Output() search = new EventEmitter<QueryModel>();
    @Input() display: boolean = false;
    @Input() hiddens: string[] = [];
    model: QueryModel = new QueryModel();
    groups: Selection[] = [];
    userLevels: Selection[] = [];
    userTypes: number[] = [UserType.ENTERPRISE, UserType.INDIVIDUAL, UserType.OPERATOR, UserType.STAFF];

    constructor(
        private userLevelService: UserLevelService
    ) { }

    async ngOnInit() {
        await this.getUserLevels();
    }

    async getUserLevels() {
        const response = await this.userLevelService.getUserLevels(this.model);
        this.userLevels = response.data;
    }

    searchEvent() {
        this.search.emit(this.model);
    }
}
