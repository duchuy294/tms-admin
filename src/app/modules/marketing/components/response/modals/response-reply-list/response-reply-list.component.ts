import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
  } from '@angular/core';
import { QueryModel } from '@/models/query.model';
import { ResponseService } from '@/modules/marketing/services/response.service';

@Component({
  selector: 'response-reply-list',
  templateUrl: './response-reply-list.component.html',
  styleUrls: ['./response-reply-list.component.less']
})
export class ResponseReplyListComponent implements OnChanges {
  adminRepliedBy: { [_id: string]: AccountModel } = {};
  queryModel: QueryModel = new QueryModel();
  replyList = [];

  @Input() response: any;
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter<boolean>();

  constructor(
    private adminService: AdminService,
    private responseService: ResponseService,
  ) { }

  async ngOnChanges() {
    if (this.visible) {
      if (this.response) {
        const apiResponse = await this.responseService.getReplies(this.response._id, this.queryModel);
        this.replyList = [...apiResponse];

        const repliedBy = await this.getAdmins(this.replyList, 'repliedBy');
        _.forEach(repliedBy, admin => {
          this.adminRepliedBy[admin._id] = admin;
        });
      }
    } else {
      this.replyList = [];
    }
  }

  async getAdmins(data, field: string = '') {
    const accountIds = _.map(data, email => email[field]).join(',');
    const adminPaging = await this.adminService.getAdmins(new QueryModel({ accountIds }));
    return adminPaging.data;
  }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }
}
