import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroupServicerDetail } from './../../../../../../modules/servicer/models/group-servicer/group-servicer-detail.model';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { TeamServicerPage } from './../../../../../../modules/servicer/models/team-servicer/team-servicer.model';

@Component({
  selector: 'group-servicer-detail-grid',
  templateUrl: './group-servicer-detail-grid.component.html'
})
export class GroupServicerDetailGridComponent implements OnInit {
  id = this.route.snapshot.paramMap.get('id');
  model = new PagingModel<TeamServicerPage>();
  loadingGrid = false;
  @Input() queryModel: QueryModel = new QueryModel({ _id: this.id });
  @Output() totalTeams = new EventEmitter<number>();
  @Output() groupServiceDetail = new EventEmitter<GroupServicerDetail>();
  constructor(
    private route: ActivatedRoute,
    private modalService: ModalService,
    private service: ServicerService
  ) { }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData(modelQuery: QueryModel = null) {
    this.loadingGrid = true;
    if (modelQuery) {
      this.queryModel = modelQuery;
    }
    const dataResult = await (await this.service.getGroupServicer(this.queryModel.urlDetail()));
    this.model = dataResult.servicerTeams;
    this.groupServiceDetail.emit(dataResult);
    this.totalTeams.emit(this.model.total);
    this.loadingGrid = false;
  }

  async loadDataByPage(event: number = 1) {
    this.model.page = event;
    await this.loadData();
  }

  async loadDataByPageSize(event: number = 20) {
    this.model.limit = event;
    await this.loadData();
  }

  confirmDelete(id: string) {
    this.modalService.confirm(
      { title: 'Xác nhận', message: 'Bạn muốn xóa?' },
      () => this.delete(id)
    );
  }

  async delete(id: string) {
    await this.service.deleteServicerOfGroup(id);
    await this.loadData();
  }
}