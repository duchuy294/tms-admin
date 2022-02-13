import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { FilterService } from '../../../../modules/utility/services/filter.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '../../../../models/query.model';
import { Selection } from '../../../../modules/utility/models/filter.model';
import { ServicerService } from '../../../../modules/servicer/services/servicer.service';
import { ServicerType } from '@/constants/ServicerType';
import { UserStatus } from '../../../../../app/constants/UserStatus';


@Component({
  selector: 'filter-servicer-new',
  templateUrl: './filter-servicer-new.component.html'
})
export class FilterServicerNewComponent implements OnInit {
  @Input() display: boolean = false;
  model: QueryModel = new QueryModel();
  groups: Selection[] = [];
  teams: Selection[] = [];
  searchTime: Date[];
  servicerTypes = [ServicerType.Personal, ServicerType.Enterprise, ServicerType.EnterpriseStaff];
  statuses: UserStatus[] = [UserStatus.NEW, UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED];
  _selectedServicer = null;

  servicerSearchCondition = {
    fields: 'fullName,phone,code'
  };

  @ViewChild('filterServicer') filterServicer: NgForm;

  @Output() search = new EventEmitter<QueryModel>();
  @Output() onReset = new EventEmitter<QueryModel>();
  ranges1 = {
    Today: [new Date(), new Date()]
  };
  set selectedServicer(value) {
    if (_.isArray(value) || (value === null)) {
      this._selectedServicer = value;
    }
  }

  get selectedServicer() {
    return this._selectedServicer;
  }

  constructor(private filterService: FilterService, private servicerService: ServicerService) { }

  async ngOnInit() {
    await this.getGroups();
    await this.getTeams();
  }

  async getGroups() {
    const result = await this.servicerService.getGroupServicers(new QueryModel({ limit: 1000 }));
    this.groups = result.data;
  }

  async getTeams() {
    this.teams = await this.filterService.getTeams();
    this.model.teamId = null;
  }

  async reset() {
    this.model = new QueryModel();
    this.searchTime = [];
    this._selectedServicer = null;
    CommonHelper.resetForm(this.filterServicer);
    await this.getGroups();
    await this.getTeams();
    this.onReset.emit(new QueryModel({ page: 1, limit: 20 }));

  }

  searchEvent() {
    if (!_.isEmpty(this.searchTime)) {
      this.model.startTime = DateTimeService.convertDateToTimestamp(this.searchTime[0]);
      this.model.endTime = DateTimeService.convertDateToTimestamp(this.searchTime[1], null, true);
    } else {
      delete this.model.startTime;
      delete this.model.endTime;
    }
    if (!_.isEmpty(this._selectedServicer)) {
      this.model.servicerIds = this._selectedServicer;
    } else {
      delete this.model.servicerIds;
    }
    this.model.page = 1;
    this.search.emit(this.model);
  }

}
