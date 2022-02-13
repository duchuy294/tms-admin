import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
    Selection
} from '../../../../modules/utility/models/filter.model';
import { FilterService } from '../../../../modules/utility/services/filter.service';
import { QueryModel } from '../../../../models/query.model';
import { ServicerService } from '../../../../modules/servicer/services/servicer.service';

@Component({
    selector: 'filter-servicer',
    templateUrl: 'filter-servicer.component.html'
})
export class FilterServicerComponent implements OnInit {
    @Output() search = new EventEmitter<QueryModel>();
    @Input() display: boolean = false;
    @Input() hiddens: string[] = [];
    @Input() model: QueryModel = new QueryModel();
    groups: Selection[] = [];
    teams: Selection[] = [];

    constructor(private filterService: FilterService, private servicerService: ServicerService) { }

    async ngOnInit() {
        await this.getGroups();
        await this.getTeams();
    }

    async getStatuses() {
        this.model.status = '';
    }

    async getGroups() {
        const result = await this.servicerService.getGroupServicers(new QueryModel({ limit: 1000 }));
        this.groups = result.data;
    }

    async getTeams() {
        this.teams = await this.filterService.getTeams();
        this.model.teamId = '';
    }

    searchEvent() {
        this.search.emit(this.model);
    }
}
