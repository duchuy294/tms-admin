import { AdidiBranchGridComponent } from './../adidi-branch-grid/adidi-branch-grid.component';
import { BranchModel } from '@/modules/admin/models/branch.model';
import { BranchService } from '@/modules/admin/services/branch.service';
import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'adidi-branch-list',
  templateUrl: './adidi-branch-list.component.html'
})
export class AdidiBranchListComponent {
  addBranchModalVisible: boolean = false;
  branchToEdit: BranchModel = null;
  cityName: string;
  @ViewChild('branchGrid') branchGrid: AdidiBranchGridComponent;

  constructor(
    private branchService: BranchService,
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private translateService: TranslateService,
  ) { }

  handleAddBranchModalVisible(flag = true) {
    this.addBranchModalVisible = !!flag;
  }

  addBranch() {
    this.branchToEdit = null;
    this.handleAddBranchModalVisible();
  }

  async editBranch(branchId) {
    const branchInstance = await this.branchService.getBranch(branchId, new QueryModel({ fields: 'name,order,address,location' }));
    this.branchToEdit = branchInstance;
    this.handleAddBranchModalVisible();
  }

  confirmDelete(branchId) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('common.confirmDelete'),
      nzOnOk: () => this.deleteBranch(branchId),
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('common.delete')
    });
  }

  async deleteBranch(branchId) {
    const response = await this.branchService.removeBranch(branchId);
    if (response.errorCode === 0) {
      this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.branch').toLowerCase()} ${this.translateService.instant('common.successfully').toLowerCase()}`);
    } else {
      this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.branch').toLowerCase()} ${this.translateService.instant('common.failed').toLowerCase()}`);
    }
    this.handleAfterSubmit();
  }

  handleAfterSubmit() {
    this.branchGrid.loadData();
    this.cityName = null;
  }

  onCityNameChange($event) {
    this.branchGrid.loadData($event);
  }
}
