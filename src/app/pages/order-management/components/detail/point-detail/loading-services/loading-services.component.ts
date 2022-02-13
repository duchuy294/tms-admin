import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';

@Component({
  selector: 'loading-services',
  templateUrl: './loading-services.component.html',
  styleUrls: ['./loading-services.component.less']
})

export class LoadingServicesComponent {
  @Input() services: ServiceModel[] = [];
  @Input() visible: boolean = false;
  @ViewChild('serviceForm') serviceForm: NgForm;
  selectedServices: ServiceModel[] = [];
  ServiceStyle = ServiceStyle;

  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() handleLoading = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<ServiceModel[]>();

  reset() {
    CommonHelper.resetForm(this.serviceForm);
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  handleVisibleModal(flag = false) {
    this.handleVisible.emit(!!flag);
  }

  handleLoadingModal(flag = false) {
    this.handleLoading.emit(!!flag);
  }

  onServicesChanges(services: ServiceModel[]): void {
    this.selectedServices = services;
  }

  update() {
    this.submit.emit(_.cloneDeep(this.selectedServices));
    this.selectedServices = [];
  }
}
