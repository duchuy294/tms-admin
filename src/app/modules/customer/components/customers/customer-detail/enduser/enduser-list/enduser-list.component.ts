import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { EndUser } from '@/modules/customer/models/enduser-detail.model';
import { EnduserGridComponent } from './../enduser-grid/enduser-grid.component';
import { EndUserService } from '@/modules/customer/services/enduser.service';
import { FileType } from '@/constants/file-type.enum';
import { FilterEnduserComponent } from './../filter-enduser/filter-enduser.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'enduser-list',
  templateUrl: './enduser-list.component.html',
  styleUrls: ['./enduser-list.component.less']
})
export class EndUserListComponent implements OnInit {
  createModifyModalVisible: boolean = false;
  createModifyModalVisibleSubEndUser: boolean = false;
  filterVisible: boolean = false;
  modifyingModel: EndUser;
  userId = this.route.snapshot.paramMap.get('id');
  byte: number = 1048576;
  endUserId: string = null;
  upFileList: NzUploadFile = null;
  @ViewChild('grid') grid: EnduserGridComponent;
  @ViewChild('filter') filter: FilterEnduserComponent;
  showUploadList: boolean = false;
  customer: any = null;
  excels: string[] = [FileType.EXCEL_XLSX, FileType.EXCEL_XLS, FileType.EXCEL_XLSM, FileType.EXCEL_XLTX, FileType.EXCEL_XLT];
  constructor(
    private messageService: NzMessageService,
    private modelService: NzModalService,
    private translateService: TranslateService,
    private endUserService: EndUserService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
  ) { }

  beforeUpload = () => {
    return true;
  }
  async ngOnInit() {
    this.customer = await this.customerService.getCustomer(this.userId);
  }

  handleModelVisible(flag = true) {
    this.createModifyModalVisible = !!flag;
  }

  handleModalVisibleSubEndUser(flag = true) {
    this.createModifyModalVisibleSubEndUser = !!flag;
  }

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  search(query: QueryModel) {
    this.grid.triggerLoadData(query);
  }

  create() {
    this.modifyingModel = null;
    this.handleModelVisible(true);
  }

  async modify(id: string = null) {
    const enduser = await this.endUserService.getEnduser(id);
    this.modifyingModel = enduser;
    this.handleModelVisible(true);
  }

  onFileChange(event) {
    if (event.file.status) {
      if (event.file.status === 'done') {
        if (event.file && event.file.response) {
          if (event.file.response.errorCode === 0) {
            this.messageService.success(`${this.translateService.instant('common.import')} ${this.translateService.instant('common.successfully').toLowerCase()}`);
            this.handleAfterSubmit();
          } else {
            this.messageService.error(`${this.translateService.instant('common.import')} ${this.translateService.instant('common.failed').toLowerCase()}`);
          }
        } else if (event.file.status === 'error') {
          this.messageService.error(`${this.translateService.instant('common.import')} ${this.translateService.instant('common.failed').toLowerCase()}`);
        }
      }
    }
  }

  handleAfterSubmit() {
    this.grid.loadData();
    this.filter.resetAutoSuggest();
  }

  checkFileImport(file) {
    if (file && file.file) {
      const format = file.file.name.split('.').pop();
      if (!this.excels.includes(format)) {
        this.messageService.warning(this.translateService.instant('common.invalid-format-file'));
        return false;
      } else {
        if (file.file.size > 20 * this.byte) {
          this.messageService.warning(this.translateService.instant('common.invalid-size-file'));
          return false;
        } else {
          return true;
        }
      }
    }
    this.messageService.warning(this.translateService.instant('common.invalid-file'));
    return false;
  }

  importData = (file: any) => {
    if (this.checkFileImport(file)) {
      this.modelService.confirm({
        nzTitle: this.translateService.instant('common.confirmImport'),
        nzOnOk: () => this.endUserService.import(file, this.userId),
        nzCancelText: this.translateService.instant('actions.cancel'),
        nzOkText: this.translateService.instant('end-user.import')
      });
    }
  }

  createSubEndUser(event: string = null) {
    this.endUserId = event;
    this.handleModalVisibleSubEndUser(true);
  }
}