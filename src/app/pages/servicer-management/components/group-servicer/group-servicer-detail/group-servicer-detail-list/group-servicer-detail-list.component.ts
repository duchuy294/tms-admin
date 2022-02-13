import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { GroupServicerDetail } from './../../../../../../modules/servicer/models/group-servicer/group-servicer-detail.model';
import { GroupServicerDetailGridComponent } from './../group-servicer-detail-grid/group-servicer-detail-grid.component';
import { QueryModel } from '@/models/query.model';

@Component({
  selector: 'group-servicer-detail-list',
  templateUrl: './group-servicer-detail-list.component.html',
  styleUrls: ['./group-servicer-detail-list.component.less']
})
export class GroupServicerDetailListComponent {
  @ViewChild('grid') grid: GroupServicerDetailGridComponent;
  constructor(
    private route: ActivatedRoute
  ) { }
  id = this.route.snapshot.paramMap.get('id');
  query = new QueryModel({ _id: this.id });
  visibleFilter = false;
  totalNumberTeams: number = 0;
  @Output() putGroupServiceDetail = new EventEmitter<GroupServicerDetail>();

  async search($event: QueryModel = null) {
    if ($event) {
      this.query = $event;
    }
    await this.grid.loadData(this.query);
  }

  toggleFilter() {
    this.visibleFilter = !this.visibleFilter;
  }

  assignTotalNumberTeams($event: number = 0) {
    this.totalNumberTeams = $event;
  }

  getGroupServiceDetail($event: GroupServicerDetail = null) {
    this.putGroupServiceDetail.emit($event);
  }
}