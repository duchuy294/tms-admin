import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { TeamServicerDetailListComponent } from './../../team-servicer/team-servicer-detail/team-servicer-detail-list/team-servicer-detail-list.component';

@Component({
    selector: 'group-servicer-detail',
    templateUrl: 'group-servicer-detail.component.html',
    styleUrls: ['./group-servicer-detail.component.less']
})
export class GroupServicerDetailComponent {
    displayModify = false;
    @ViewChild('list') teamServicerDetailList: TeamServicerDetailListComponent;

    toggleFilter() {
        this.teamServicerDetailList.toggleFilter();
    }

    triggerModify($event = false) {
        this.displayModify = $event;
    }
}