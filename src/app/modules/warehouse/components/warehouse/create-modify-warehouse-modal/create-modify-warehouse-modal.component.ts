import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseInformationTabComponent } from './warehouse-information-tab/warehouse-information-tab.component';
import { WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';
import { WarehouseServiceUtilityTabComponent } from './warehouse-service-utility-tab/warehouse-service-utility-tab.component';

@Component({
  selector: 'create-modify-warehouse-modal',
  templateUrl: './create-modify-warehouse-modal.component.html',
  styleUrls: ['./create-modify-warehouse-modal.component.less']
})
export class CreateModifyWarehouseModalComponent implements OnChanges {
  @Input() modifyingModel: WarehouseModel = null;
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() afterSubmit = new EventEmitter();
  @ViewChild('createModifyForm') createModifyForm: NgForm;
  @ViewChild('infoTab') infoTab: WarehouseInformationTabComponent;
  @ViewChild('serviceTab') serviceTab: WarehouseServiceUtilityTabComponent;
  limit = 100;
  isProcessing: boolean = false;
  model: WarehouseModel = new WarehouseModel({ status: Status.NEW });
  typeList = [];
  statusList = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];
  _startAt: any = null;
  selectedTabIndex = 0;

  constructor(
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private warehouseService: WarehouseService,
  ) { }

  async ngOnChanges() {
    if (this.visible) {
      await this.getType();
      this.init();
    }
  }

  async getType() {
    const response = await this.warehouseService.filterWarehouseType(new QueryModel({ limit: this.limit }));
    this.typeList = response.data;
  }


  handleVisibleModal(flag = false) {
    this.handleVisible.emit(!!flag);
  }

  init() {
    this._startAt = null;
    if (this.modifyingModel) {
      this.model = _.cloneDeep(this.modifyingModel);
      if (this.model.startedAt) {
        this._startAt = new Date(this.model.startedAt);
      }
    } else {
      this.model = new WarehouseModel({ status: Status.NEW });
    }
    this.selectedTabIndex = 0;
  }

  postProcessLocation() {
    if (this.model._id) {
      delete this.model.location.lat;
      delete this.model.location.lng;
      delete this.model.location.latitude;
      delete this.model.location.longitude;
    }
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    this.infoTab.submit();
    this.serviceTab.submit();
    this.warehouseService.trimData(this.model);
    const validResponses = [this.createModifyForm.valid, this.infoTab.valid(), this.serviceTab.valid()];
    if (validResponses[0] && validResponses[1] && validResponses[2]) {
      this.postProcessLocation();
      this.isProcessing = true;
      let response;
      if (this.modifyingModel) {
        response = await this.warehouseService.updateWarehouse(this.model);
      } else {
        response = await this.warehouseService.createWarehouse(this.model);
      }
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.afterSubmit.emit();
        this.handleVisibleModal(false);
        this.messageService.success(`${this.translateService.instant(`actions.${this.modifyingModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
    } else {
      if (!validResponses[1]) {
        this.selectedTabIndex = 0;
      } else if (!validResponses[2]) {
        this.selectedTabIndex = 1;
      }
      CommonHelper.validateForm(this.createModifyForm);
      this.infoTab.validateForm();
      this.serviceTab.validateForm();
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  reset() {
    this.init();
    this.infoTab.reset();
    this.serviceTab.reset();
    CommonHelper.resetForm(this.createModifyForm);
  }

  handleSubmit($event) {
    _.assignIn(this.model, _.pick($event.model, $event.model[$event.fields]));
  }

  onChangeStartAt($event) {
    if ($event) {
      this.model.startedAt = DateTimeService.convertDateToTimestamp(new Date($event));
    } else {
      delete this.model.startedAt;
    }
  }

  validateType() {
    return !_.isEmpty(this.model.typeIds);
  }
}
