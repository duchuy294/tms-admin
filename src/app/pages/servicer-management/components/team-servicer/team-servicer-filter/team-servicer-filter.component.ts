import * as _ from 'lodash';
import { CommonHelper } from './../../../../../modules/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateTimeService } from './../../../../../modules/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from './../../../../../models/query.model';
import { Selection } from './../../../../../modules/utility/models/filter.model';
import { ServicerService } from './../../../../../modules/servicer/services/servicer.service';
import { UserStatus } from './../../../../../constants/UserStatus';

@Component({
  selector: 'team-servicer-filter',
  templateUrl: './team-servicer-filter.component.html'
})
export class TeamServicerFilterComponent implements OnInit {
  model = new QueryModel();
  groups: Selection[] = [];
  searchTime: Date[] = [];
  statuses: UserStatus[] = [UserStatus.NEW, UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED];
  @Input() display: boolean = false;
  @ViewChild('filterTeamServicer')
  filterTeamServicer: NgForm;
  @Output() search = new EventEmitter<QueryModel>();
  @Output() onReset = new EventEmitter<QueryModel>();
  ranges1 = {
    Today: [new Date(), new Date()]
  };
  constructor(
    private servicerServicer: ServicerService
  ) { }

  async ngOnInit() {
    await this.getGroups();
  }

  async getGroups() {
    const result = await this.servicerServicer.getGroupServicers(new QueryModel({ limit: 1000 }));
    this.groups = result.data;
  }

  async reset() {
    this.model = new QueryModel();
    this.searchTime = [];
    CommonHelper.resetForm(this.filterTeamServicer);
    await this.getGroups();
    const defaultPage = 1;
    const defaultLimit = 20;
    this.onReset.emit(new QueryModel({ page: defaultPage, limit: defaultLimit }));
  }

  searchEvent() {
    if (!_.isEmpty(this.searchTime)) {
      this.model.startTime = DateTimeService.convertDateToTimestamp(this.searchTime[0]);
      this.model.endTime = DateTimeService.convertDateToTimestamp(this.searchTime[1], null, true);
    } else {
      delete this.model.startTime;
      delete this.model.endTime;
    }
    this.model.page = 1;
    this.search.emit(this.model);
  }
}