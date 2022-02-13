import { Component, Input, OnInit } from '@angular/core';
import { MultiLanguageString } from './../../../../../models/multi-language/multi-string';
import { OrderModel } from './../../../../../modules/order/models/order.model';
import { Servicer } from './../../../../../modules/servicer/models/servicer/servicer.model';
import { TranslateService } from '@ngx-translate/core';
import { VehicleService } from './../../../../../modules/delivery/services/vehicle.service';
import { VehicleType } from './../../../../../models/vehicle-type.model';

@Component({
  selector: 'servicer-profile',
  templateUrl: './servicer-profile.component.html',
  styleUrls: ['./servicer-profile.component.less']
})
export class ServicerProfileComponent implements OnInit {
  servicer: Servicer = null;
  loading = false;
  loadingVechile = false;
  loadingOrdersOfServicer = false;
  lang = 'vi';
  incidentOrdersOfServicer: OrderModel[] = [];
  processingOrdersOfServicer: OrderModel[] = [];
  vehicleName: { [_id: string]: MultiLanguageString } = {};
  public vehicle: VehicleType[] = [];
  @Input() set servicerModel(value: Servicer) {
    this.loading = true;
    this.servicer = value;
    this.loading = false;
  }

  @Input() collectionDebt: number;

  @Input() set setIncidentOrders(value: OrderModel[]) {
    this.loadingOrdersOfServicer = true;
    this.incidentOrdersOfServicer = value;
    this.loadingOrdersOfServicer = false;
  }

  @Input() set setProcessingOrders(value: OrderModel[]) {
    this.loadingOrdersOfServicer = true;
    this.processingOrdersOfServicer = value;
    this.loadingOrdersOfServicer = false;
  }
  constructor(
    private readonly translateService: TranslateService,
    private vehicleService: VehicleService,
  ) { }

  async ngOnInit() {
    window.scrollTo(0, 0);
    await this.loadTypeVehicle();
    this.lang = this.translateService.currentLang;
  }

  get servicerRating() {
    return this.servicer && this.servicer.rate ? this.servicer.rate : 5;
  }

  get notRated() {
    if (this.servicer) {
      if (this.servicerRating < 5) {
        return false;
      }
      if (!this.servicer.rateTimes || this.servicer.rateTimes === 0) {
        return true;
      }
      return false;
    }
    return true;
  }

  async loadTypeVehicle() {
    this.loadingVechile = true;
    this.vehicle = await this.vehicleService.getVehicleTypes();
    this.vehicle.forEach(item => {
      if (item.children) {
        item.children.forEach(itemChildren => {
          this.vehicleName[itemChildren._id] = itemChildren.name;
        });
      } else {
        if (item.name) {
          this.vehicleName[item._id] = item.name;
        }
      }
    });
    this.loadingVechile = false;
  }
}