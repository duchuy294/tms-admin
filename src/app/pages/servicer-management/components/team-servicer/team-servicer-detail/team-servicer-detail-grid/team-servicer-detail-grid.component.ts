import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Servicer } from 'app/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';

@Component({
  selector: 'team-servicer-detail-grid',
  templateUrl: './team-servicer-detail-grid.component.html'
})
export class TeamServicerDetailGridComponent implements OnInit {
  id = this.route.snapshot.paramMap.get('id');
  model = new PagingModel<Servicer>();
  loadingGrid = false;
  @Input() queryModel: QueryModel = new QueryModel({ teamId: this.id });
  @Output() totalServicers = new EventEmitter<number>();
  constructor(private modalService: ModalService,
    private service: ServicerService,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    await this.loadData();
  }

  confirmDelete(id: string) {
    this.modalService.confirm(
      { title: 'Xác nhận', message: 'Bạn muốn xóa?' },
      () => this.delete(id)
    );
  }

  async loadData(modelQuery: QueryModel = null) {
    this.loadingGrid = true;
    if (modelQuery) {
      this.queryModel = modelQuery;
    }
    this.model = await this.service.getServicers(this.queryModel);
    this.totalServicers.emit(this.model.total);
    this.loadingGrid = false;
  }

  async loadDataByPage(event = 1) {
    this.model.page = event;
    await this.loadData();
  }

  async loadDataByPageSize(event = 20) {
    this.model.limit = event;
    await this.loadData();
  }

  async delete(id: string) {
    await this.service.deleteServicerOfTeam(id);
    await this.loadData();
  }
}