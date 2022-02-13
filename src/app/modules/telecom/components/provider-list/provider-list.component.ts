import { ChangeProviderPasswordComponent } from './../modals/change-provider-password/change-provider-password.component';
import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProviderGridComponent } from './../provider-grid/provider-grid.component';
import { ProviderModel } from '../../models/provider.model';
import { ProviderService } from '../../services/provider.service';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'provider-list',
  templateUrl: './provider-list.component.html'
})
export class ProviderListComponent {
  @ViewChild('changePasswordModal') changePasswordModal: ChangeProviderPasswordComponent;
  @ViewChild('providerGrid') providerGrid: ProviderGridComponent;
  changePasswordId: string = null;
  changePasswordModalVisible: boolean = null;
  createProviderModalVisible: boolean = null;
  providerToEdit: ProviderModel = null;

  constructor(
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private translateService: TranslateService,
    private providerService: ProviderService
  ) { }

  handleChangePasswordModalVisible(flag = true) {
    this.changePasswordModalVisible = !!flag;
  }

  handleChangePassword() {
    this.handleChangePasswordModalVisible();
  }

  handleCreateProviderModalVisible(flag = true) {
    this.createProviderModalVisible = !!flag;
  }

  handleCreateProvider() {
    this.providerToEdit = null;
    this.handleCreateProviderModalVisible();
  }

  async handleEditProvider(providerId) {
    const providerInstance = await this.providerService.get(providerId);
    this.providerToEdit = providerInstance;
    this.handleCreateProviderModalVisible();
  }

  handleAfterSubmit() {
    this.handleReset(null);
  }

  async handleSearch(queryModel: QueryModel) {
    await this.providerGrid.triggerLoadData(queryModel, 1);
  }

  async handleReset(queryModel: QueryModel) {
    await this.providerGrid.triggerLoadData(queryModel, 1);
  }

  confirmDelete(regionId) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('common.confirmDelete'),
      nzOnOk: () => this.delete(regionId),
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('common.delete')
    });
  }

  async changePassword(providerId) {
    this.changePasswordId = providerId;
    this.handleChangePasswordVisible(true);
  }

  async delete(regionId) {
    const response = await this.providerService.remove(regionId);
    if (response.errorCode === 0) {
      this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.successfully').toLowerCase()}`);
      await this.providerGrid.loadData();
    } else {
      this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.failed').toLowerCase()}`);
    }
  }

  handleChangePasswordVisible(flag = true) {
    this.changePasswordModalVisible = !!flag;
    if (!flag) {
      this.changePasswordModal.reset();
    }
  }

  confirmActivate({ providerId, active }) {
    let response = true;
    this.modalService.confirm({
      nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
      nzOnOk: () => this.activate(providerId, active),
      nzOnCancel: () => { response = false; },
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('button.confirm')
    });
    return response;
  }

  async activate(providerId, active) {
    const response = await this.providerService.activate({ _id: providerId, active });
    if (response) {
      this.messageService.success(this.translateService.instant(`telecom.providers-status.${(active) ? 'activate-complete' : 'deactivate-complete'}`));
      await this.providerGrid.loadData();
    } else {
      this.messageService.error(this.translateService.instant(`telecom.providers-status.${(active) ? 'activate-fail' : 'deactivate-fail'}`));
    }
  }
}
