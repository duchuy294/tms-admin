import { ActivatedRoute } from '@angular/router';
import { Component, ViewChild, Input } from '@angular/core';
import { QueryModel } from '@/models/query.model';
import { TeamServicerDetailGridComponent } from './../team-servicer-detail-grid/team-servicer-detail-grid.component';

@Component({
  selector: 'team-servicer-detail-list',
  templateUrl: './team-servicer-detail-list.component.html',
  styleUrls: ['./team-servicer-detail-list.component.less']
})
export class TeamServicerDetailListComponent {
  @ViewChild('grid') grid: TeamServicerDetailGridComponent;
  @Input() queryData: string = 'teamId';
  id = this.route.snapshot.paramMap.get('id');
  query = new QueryModel();
  visibleFilter = false;
  totalNumberServicers: number = 0;

  constructor(
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.query = new QueryModel({ [this.queryData]: this.id });
  }

  async search($event = new QueryModel()) {
    this.query = $event;
    await this.grid.loadData(this.query);
  }

  toggleFilter() {
    this.visibleFilter = !this.visibleFilter;
  }

  assignTotalNumberServicers($event = 1) {
    this.totalNumberServicers = $event;
  }
}