import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { DeliveryFeeModel } from 'app/modules/price/models/delivery-fee.model';
import { DeliveryFeeService } from './../../../../../modules/price/services/delivery-fee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PriceSettingService } from './../../../services/price-setting.service';
import { PriceSettingType } from './../../../constants/PriceSettingType';
import { QueryModel } from '@/models/query.model';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServiceUnitModel } from './../../../../../modules/price/models/service-unit.model';
import { ServiceUnitService } from './../../../services/service-unit.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadFilesModel } from 'app/modules/utility/models/upload-files.model';
import { UploadService } from 'app/modules/utility/services/upload.service';
import { VehicleService } from './../../../../../modules/delivery/services/vehicle.service';
import { VehicleType } from './../../../../../models/vehicle-type.model';
import { VehicleTypeDeliveryFeeModel } from './../../../models/vehicle-type-delivery-fee.model';

@Component({
  selector: 'price-delivery',
  templateUrl: 'price-delivery.component.html'
})
export class PriceDeliveryComponent implements OnInit {
  units: ServiceUnitModel[] = [];
  lang = 'vi';
  @Input() public priceFormId;
  public vehicleTypes: VehicleTypeDeliveryFeeModel[] = [];

  constructor(
    public priceSettingService: PriceSettingService,
    public translateService: TranslateService,
    public uploadService: UploadService,
    public serviceUnitService: ServiceUnitService,
    public messageService: NzMessageService,
    public vehicleService: VehicleService,
    public deliveryFeeService: DeliveryFeeService) { }

  async ngOnInit() {
    this.units = await this.serviceUnitService.list();
    const vehicleTypes = (await this.vehicleService.getVehicleTypes(true)) as VehicleTypeDeliveryFeeModel[];
    const deliveryFees = (await this.deliveryFeeService.filter(new QueryModel({ limit: 1000, priceFormId: this.priceFormId }))).data;
    this.vehicleTypes = this._addDeliveryFeeToVehicleType(vehicleTypes, deliveryFees);
    this.lang = this.translateService.currentLang;
  }

  _addDeliveryFeeToVehicleType(vehicleTypes: VehicleTypeDeliveryFeeModel[], fees: DeliveryFeeModel[]) {
    return _.map(vehicleTypes, vehicleType => {
      const fee = _.find(fees, x => x.vehicleTypeId === vehicleType._id);
      vehicleType.fee = fee ? fee : new DeliveryFeeModel({ vehicleTypeId: vehicleType._id });
      if (vehicleType.children && vehicleType.children.length > 0) {
        vehicleType.children = this._addDeliveryFeeToVehicleType(vehicleType.children, fees);
      }
      return vehicleType;
    });
  }

  async updateDeliveryFee(fee: DeliveryFeeModel, vehicleType: VehicleTypeDeliveryFeeModel) {
    const response = await this.deliveryFeeService.update(fee);
    if (response.errorCode !== 0) {
      this.messageService.error(response.message);
    } else {
      vehicleType.changed = false;
    }
  }

  async onPriceChange(service: ServiceModel) {
    service.changed = true;
  }

  async _addService(service: ServiceModel) {
    if (service.imgUrl) {
      const files = await this.uploadService.uploadBase64(new UploadFilesModel({
        files: [service.imgUrl],
        path: 'services'
      }));

      service.imgUrl = files[0].fullPath;
    }
    await this.priceSettingService.add(PriceSettingType.installation, service);
  }

  async updateVehicleType(value: string, field: string, vehicleType: VehicleType) {
    vehicleType[field] = value;
    const response = await this.vehicleService.update(vehicleType);
    if (response.errorCode !== 0) {
      this.messageService.error(response.message);
    }
  }
}