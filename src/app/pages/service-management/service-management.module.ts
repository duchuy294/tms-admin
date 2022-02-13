import { AppHttpModule } from './../../modules/http/app-http.module';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { ChangeServicerModalComponent } from './components/incident/change-servicer/change-servicer-modal.component';
import { CommonModule } from '@angular/common';
import { DeliveryModule } from './../../modules/delivery/delivery.module';
import { FilterComponent } from 'app/pages/service-management/components/filter/filter.component';
import { FinanceModule } from './../../modules/finance/finance.module';
import { FormsModule } from '@angular/forms';
import { IncidentComponent } from './components/incident/incident.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrderModule } from '../../modules/order/order.module';
import { RouterModule, Routes } from '@angular/router';
import { ServicerModule } from '../../modules/servicer/servicer.module';
import { UtilityModule } from './../../modules/utility/utility.module';

const routes: Routes = [
    { path: 'incident', component: IncidentComponent }
];

@NgModule({
    imports: [
        AppHttpModule,
        AppTranslationModule,
        CommonModule,
        DeliveryModule,
        FinanceModule,
        FormsModule,
        NgbModule,
        OrderModule,
        RouterModule.forChild(routes),
        ServicerModule,
        UtilityModule,
    ],
    declarations: [
        ChangeServicerModalComponent,
        FilterComponent,
        IncidentComponent,
    ],
    entryComponents: [
        ChangeServicerModalComponent,
    ],
    providers: []
})
export class ServiceManagementModule { }
