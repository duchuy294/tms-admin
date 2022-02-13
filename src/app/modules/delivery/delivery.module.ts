import { ApiDeliveryHttpService } from 'app/modules/delivery/services/api-delivery-http.service';
import { AppHttpModule } from '../http/app-http.module';
import { NgModule } from '@angular/core';
import { OrderReversionService } from './services/order-reversion.service';
import { ReturnService } from './services/return.service';
import { ReturnWarehouseService } from './services/return-warehouse.service';
import { VehicleService } from './services/vehicle.service';

@NgModule({
    imports: [
        AppHttpModule,
    ],
    providers: [
        ApiDeliveryHttpService,
        ReturnService,
        ReturnWarehouseService,
        VehicleService,
        OrderReversionService
    ]
})

export class DeliveryModule { }
