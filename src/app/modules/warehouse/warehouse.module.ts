import { AdminModule } from '../admin/admin.module';
import { AdminService } from '../admin/services/admin.service';
import { ApiWarehouseHttpObservableService } from './services/api-warehouse-http.observable.service';
import { ApiWarehouseHttpService } from './services/api-warehouse-http.service';
import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { AutosuggestWarehouseComponent } from './components/warehouse/autosuggest-warehouse/autosuggest-warehouse.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { CreateModifyWarehouseModalComponent } from './components/warehouse/create-modify-warehouse-modal/create-modify-warehouse-modal.component';
import { CreateModifyWarehouseServiceModalComponent } from './components/warehouse-service/create-modify-warehouse-service-modal/create-modify-warehouse-service-modal.component';
import { CreateModifyWarehouseTimelineModalComponent } from './components/warehouse-pricing-timeline/create-modify-warehouse-timeline-modal/create-modify-warehouse-timeline-modal.component';
import { CreateModifyWarehouseUtilityModalComponent } from './components/warehouse-utility/create-modify-warehouse-utility-modal/create-modify-warehouse-utility-modal.component';
import { CustomerService } from '../customer/services/customer.service';
import { CustomerServiceObservable } from '../customer/services/customer.service.observable';
import { FormsModule } from '@angular/forms';
import { LocationModule } from '../location/location.module';
import { NgModule } from '@angular/core';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { OrderModule } from '../order/order.module';
import { RouterModule, Routes } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { UtilityModule } from '@/utility/utility.module';
import { WarehouseAreaModalComponent } from './components/warehouse/warehouse-detail/warehouse-area-modal/warehouse-area-modal.component';
import { WarehouseContactActionModalComponent } from './components/warehouse-contact/warehouse-contact-action-modal/warehouse-contact-action-modal.component';
import { WarehouseContactDetailComponent } from './components/warehouse-contact/warehouse-contact-detail/warehouse-contact-detail.component';
import { WarehouseContactDetailInformationComponent } from './components/warehouse-contact/warehouse-contact-detail/warehouse-contact-detail-information/warehouse-contact-detail-information.component';
import { WarehouseContactDetailServicesComponent } from './components/warehouse-contact/warehouse-contact-detail/warehouse-contact-detail-services/warehouse-contact-detail-services.component';
import { WarehouseContactFilterComponent } from './components/warehouse-contact/warehouse-contact-filter/warehouse-contact-filter.component';
import { WarehouseContactGridComponent } from './components/warehouse-contact/warehouse-contact-grid/warehouse-contact-grid.component';
import { WarehouseContactListComponent } from './components/warehouse-contact/warehouse-contact-list/warehouse-contact-list.component';
import { WarehouseContactService } from './services/warehouse-contact.service';
import { WarehouseContactStatisticComponent } from './components/warehouse-contact/warehouse-contact-statistic/warehouse-contact-statistic.component';
import { WarehouseDetailComponent } from './components/warehouse/warehouse-detail/warehouse-detail.component';
import { WarehouseFilterComponent } from './components/warehouse/warehouse-filter/warehouse-filter.component';
import { WarehouseGridComponent } from './components/warehouse/warehouse-grid/warehouse-grid.component';
import { WarehouseInformationComponent } from './components/warehouse/warehouse-detail/warehouse-information/warehouse-information.component';
import { WarehouseInformationTabComponent } from './components/warehouse/create-modify-warehouse-modal/warehouse-information-tab/warehouse-information-tab.component';
import { WarehouseListComponent } from './components/warehouse/warehouse-list/warehouse-list.component';
import { WarehouseOrderActionModalComponent } from './components/warehouse-order/warehouse-order-action-modal/warehouse-order-action-modal.component';
import { WarehouseOrderDetailComponent } from './components/warehouse-order/warehouse-order-detail/warehouse-order-detail.component';
import { WarehouseOrderDetailInformationComponent } from '../../modules/warehouse/components/warehouse-order/warehouse-order-detail/warehouse-order-detail-information/warehouse-order-detail-information.component';
import { WarehouseOrderDetailServicesComponent } from '../../modules/warehouse/components/warehouse-order/warehouse-order-detail/warehouse-order-detail-services/warehouse-order-detail-services.component';
import { WarehouseOrderFilterComponent } from './components/warehouse-order/warehouse-order-filter/warehouse-order-filter.component';
import { WarehouseOrderGridComponent } from './components/warehouse-order/warehouse-order-grid/warehouse-order-grid.component';
import { WarehouseOrderHistoryComponent } from './components/warehouse-order/warehouse-order-history/warehouse-order-history.component';
import { WarehouseOrderHistoryFilterComponent } from './components/warehouse/warehouse-detail/warehouse-order-information/warehouse-order-history-filter/warehouse-order-history-filter.component';
import { WarehouseOrderHistoryGridComponent } from './components/warehouse/warehouse-detail/warehouse-order-information/warehouse-order-history-grid/warehouse-order-history-grid.component';
import { WarehouseOrderInformationComponent } from './components/warehouse/warehouse-detail/warehouse-order-information/warehouse-order-information.component';
import { WarehouseOrderListComponent } from './components/warehouse-order/warehouse-order-list/warehouse-order-list.component';
import { WarehouseOrderPointsComponent } from './components/warehouse-order/warehouse-order-detail/warehouse-order-points/warehouse-order-points.component';
import { WarehouseOrderStatisticComponent } from './components/warehouse-order/warehouse-order-statistic/warehouse-order-statistic.component';
import { WarehouseService } from './services/warehouse.service';
import { WarehouseServiceGridComponent } from './components/warehouse-service/warehouse-service-grid/warehouse-service-grid.component';
import { WarehouseServiceListComponent } from './components/warehouse-service/warehouse-service-list/warehouse-service-list.component';
import { WarehouseServiceObservable } from './services/warehouse.service.observable';
import { WarehouseServiceUtilityTabComponent } from './components/warehouse/create-modify-warehouse-modal/warehouse-service-utility-tab/warehouse-service-utility-tab.component';
import { WarehouseTimelineGridComponent } from './components/warehouse-pricing-timeline/warehouse-timeline-grid/warehouse-timeline-grid.component';
import { WarehouseTimelineListComponent } from './components/warehouse-pricing-timeline/warehouse-timeline-list/warehouse-timeline-list.component';
import { WarehouseUtilityGridComponent } from './components/warehouse-utility/warehouse-utility-grid/warehouse-utility-grid.component';
import { WarehouseUtilityListComponent } from './components/warehouse-utility/warehouse-utility-list/warehouse-utility-list.component';

const routes: Routes = [
    { path: 'contact/:id', component: WarehouseContactDetailComponent }
];

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        FormsModule,
        LocationModule,
        RouterModule,
        RouterModule.forChild(routes),
        TextMaskModule,
        UtilityModule,
        OrderModule,
        NzTabsModule,
        NzCalendarModule,
    ],
    declarations: [
        AutosuggestWarehouseComponent,
        CreateModifyWarehouseModalComponent,
        CreateModifyWarehouseServiceModalComponent,
        CreateModifyWarehouseTimelineModalComponent,
        CreateModifyWarehouseUtilityModalComponent,
        WarehouseContactDetailComponent,
        WarehouseContactDetailInformationComponent,
        WarehouseContactDetailServicesComponent,
        WarehouseContactFilterComponent,
        WarehouseContactGridComponent,
        WarehouseContactListComponent,
        WarehouseContactStatisticComponent,
        WarehouseDetailComponent,
        WarehouseFilterComponent,
        WarehouseGridComponent,
        WarehouseInformationComponent,
        WarehouseInformationTabComponent,
        WarehouseListComponent,
        WarehouseOrderActionModalComponent,
        WarehouseOrderDetailComponent,
        WarehouseOrderDetailInformationComponent,
        WarehouseOrderDetailServicesComponent,
        WarehouseOrderFilterComponent,
        WarehouseOrderGridComponent,
        WarehouseOrderHistoryComponent,
        WarehouseOrderListComponent,
        WarehouseOrderStatisticComponent,
        WarehouseServiceGridComponent,
        WarehouseServiceListComponent,
        WarehouseServiceUtilityTabComponent,
        WarehouseTimelineGridComponent,
        WarehouseTimelineListComponent,
        WarehouseUtilityGridComponent,
        WarehouseUtilityListComponent,
        WarehouseContactActionModalComponent,
        WarehouseOrderHistoryGridComponent,
        WarehouseOrderInformationComponent,
        WarehouseOrderHistoryFilterComponent,
        WarehouseOrderPointsComponent,
        WarehouseAreaModalComponent,
    ],
    providers: [
        AdminService,
        ApiWarehouseHttpObservableService,
        ApiWarehouseHttpService,
        CustomerService,
        CustomerServiceObservable,
        WarehouseContactService,
        WarehouseService,
        WarehouseServiceObservable,
    ],
    exports: [
        WarehouseContactListComponent,
        WarehouseDetailComponent,
        WarehouseListComponent,
        WarehouseOrderListComponent,
        WarehouseServiceListComponent,
        WarehouseTimelineListComponent,
        WarehouseUtilityListComponent,
        WarehouseOrderDetailComponent,
        WarehouseOrderHistoryComponent,
    ]
})
export class WarehouseModule { }
