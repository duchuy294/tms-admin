import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GroupServicer } from '@/modules/servicer/models/group-servicer/group-servicer.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { TeamServicer } from '@/modules/servicer/models/team-servicer/team-servicer.model';
import { UserStatus } from '@/constants/UserStatus';

@Component({
  selector: 'team-servicer-detail-information',
  templateUrl: './team-servicer-detail-information.component.html',
  styleUrls: ['./team-servicer-detail-information.component.less']
})
export class TeamServicerDetailInformationComponent implements OnInit {
  model = new TeamServicer();
  loading = false;
  id = this.route.snapshot.paramMap.get('id');
  groups: GroupServicer[] = [];
  statuses: UserStatus[] = [UserStatus.NEW, UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED];
  createModifyModalVisible = false;

  constructor(
    private service: ServicerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getTeamServicer();
    this.getSelection();
  }

  async getTeamServicer() {
    this.loading = true;
    this.model = await this.service.getTeamServicer(this.id);
    this.loading = false;
  }

  async getSelection() {
    const result = await this.service.getGroupServicers(new QueryModel({ limit: 1000 }));
    this.groups = result.data;
  }

  handleModelVisible(flag = true) {
    this.createModifyModalVisible = !!flag;
  }
}