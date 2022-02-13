import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GroupServicerDetail } from './../../../../../../modules/servicer/models/group-servicer/group-servicer-detail.model';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { QueryModel } from 'app/models/query.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { UserStatus } from '@/constants/UserStatus';

@Component({
  selector: 'group-servicer-detail-information',
  templateUrl: './group-servicer-detail-information.component.html',
  styleUrls: ['./group-servicer-detail-information.component.less']
})
export class GroupServicerDetailInformationComponent implements OnInit {
  loading = false;
  id = this.route.snapshot.paramMap.get('id');
  model = new GroupServicerDetail();
  statuses: UserStatus[] = [UserStatus.NEW, UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED];
  createModifyModalVisible = false;
  queryModel: QueryModel = new QueryModel({ _id: this.id });
  @Output() triggerModify = new EventEmitter<boolean>();

  constructor(
    private route: ActivatedRoute,
    private modalService: ModalService,
    private service: ServicerService
  ) { }

  ngOnInit() {
    this.loadData();
  }
  async updateModel() {
    const result = await this.service.updateGroupServicer(this.model);
    this.modalService.info(result.errorCode);
  }

  handleModelVisible(flag = true) {
    this.createModifyModalVisible = !!flag;
  }

  async loadData() {
    this.model = await this.service.getGroupServicer(this.queryModel.urlDetail());
  }
}