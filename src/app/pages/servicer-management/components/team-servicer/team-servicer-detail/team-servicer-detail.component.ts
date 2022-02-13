import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { TeamServicerDetailListComponent } from './team-servicer-detail-list/team-servicer-detail-list.component';

@Component({
    selector: 'team-servicer-detail',
    templateUrl: 'team-servicer-detail.component.html',
    styleUrls: ['./team-servicer-detail.component.less']
})
export class TeamServicerDetailComponent {
    @ViewChild('list') teamServicerDetailList: TeamServicerDetailListComponent;

    toggleFilter() {
        this.teamServicerDetailList.toggleFilter();
    }
}