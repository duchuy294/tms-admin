import { RouterModule, Routes } from '@angular/router';

import { ActivityModule } from './../../modules/activity/activity.module';
import { AdminModule } from './../../modules/admin/admin.module';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { DeliveryModule } from '../../modules/delivery/delivery.module';
import { EditOrderCollectionComponent } from './components/detail/modal/edit-order-collection/edit-order-collection.component';
import { FormsModule } from '@angular/forms';
import { HandoverSessionsCompleteModalComponent } from './components/handover-sessions/handover-sessions-complete-modal/handover-sessions-complete-modal.component';
import { HandoverSessionsComponent } from './components/handover-sessions/handover-sessions/handover-sessions.component';
import { HandoverSessionsDetailComponent } from './components/handover-sessions/handover-sessions-detail/handover-sessions-detail.component';
import { HandoverSessionsFiltersComponent } from './components/handover-sessions/handover-sessions-filters/handover-sessions-filters.component';
import { HandoverSessionsListComponent } from './components/handover-sessions/handover-sessions-list/handover-sessions-list.component';
import { HandoverSessionsService } from './service/handover-sessions.service';
import { LimitOrdersComponent } from 'app/modules/order/components/limit-orders/limit-orders.component';
import { LoadingServicesComponent } from './components/detail/point-detail/loading-services/loading-services.component';
import { LocationModule } from 'app/modules/location/location.module';
import { MessengerModule } from './../../modules/messenger/messenger.module';
import { NewOrderCancelComponent } from './components/detail/modal/new-order-cancel/new-order-cancel.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { OrderCancelComponent } from './components/detail/modal/order-cancel/order-cancel.component';
import { OrderDeleteMarkerComponent } from './components/detail/modal/order-delete-marker/order-delete-marker.component';
import { OrderDetailComponent } from './components/detail/order-detail.component';
import { OrderDetailControllerComponent } from './components/order-detail-controller/order-detail-controller.component';
import { OrderDetailService } from './service/order-detail.service';
import { OrderDetailServicesComponent } from './components/detail/services/order-detail-services.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderManagementComponent } from './components/order-management.component';
import { OrderMapComponent } from './components/order-map/order-map.component';
import { OrderModalComponent } from './components/detail/modal/order-modal.component';
import { OrderModule } from './../../modules/order/order.module';
import { OrderReachModalComponent } from './components/detail/modal/order-reach/order-reach-modal.component';
import { OrderRefundComponent } from './components/detail/modal/order-refund/order-refund.component';
import { OrderSkipMarkerComponent } from './components/detail/modal/order-skip-marker/order-skip-marker.component';
import { PointDetailComponent } from './components/detail/point-detail/point-detail.component';
import { PointIncidentComponent } from './components/detail/point-detail/point-incident/point-incident.component';
import { PointProductComponent } from './components/detail/point-detail/point-product/point-product.component';
import { PointServiceComponent } from './components/detail/point-detail/point-service/point-service.component';
import { ReportModule } from './../../modules/report/report.module';
import { RestrictedReachComponent } from 'app/modules/order/components/restricted-reach/restricted-reach.component';
import { RestrictedTimeoutComponent } from '@/modules/order/components/restricted-timeout/restricted-timeout.component';
import { ReturnFilterComponent } from './components/return/return-filter/return-filter.component';
import { ReturnManagementComponent } from './components/return/return-management.component';
import { ReverOrderStatusModalComponent } from './components/detail/modal/revert-order-status-modal/revert-order-status-modal.component';
import { ServicerModule } from '../../modules/servicer/servicer.module';
import { UtilityModule } from './../../modules/utility/utility.module';
import { WarehouseModule } from '@/modules/warehouse/warehouse.module';
import { WarrantyRepairModule } from 'app/modules/warranty-repair/warranty-repair.module';
import { WarrantyRepairPointMoreDetailComponent } from './components/detail/point-detail/warranty-repair-point-more-detail/warranty-repair-point-more-detail.component';
import { HandoverSessions3PLComponent } from './components/handover-sessions-3pl/handover-sessions-3pl/handover-sessions-3pl.component';
import { HandoverSessionsDetail3PLComponent } from './components/handover-sessions-3pl/handover-sessions-detail-3pl/handover-sessions-detail-3pl.component';
import { HandoverSessionsFilters3PLComponent } from './components/handover-sessions-3pl/handover-sessions-filters-3pl/handover-sessions-filters-3pl.component';
import { HandoverSessionsList3PLComponent } from './components/handover-sessions-3pl/handover-sessions-list-3pl/handover-sessions-list-3pl.component';
import { HandoverSessions3PLService } from './service/handover-sessions-3pl.service';
import { ReportListComponent } from './components/report/report-list/report-list.component';

const routes: Routes = [
    { path: '', component: OrderManagementComponent },
    { path: 'restricted-reach', component: RestrictedReachComponent },
    { path: 'restricted-timeout', component: RestrictedTimeoutComponent },
    { path: 'limit-orders', component: LimitOrdersComponent },
    { path: 'handover-sessions', component: HandoverSessionsComponent },
    { path: 'report-list', component: ReportListComponent },
    {
        path: 'handover-sessions/:id',
        component: HandoverSessionsDetailComponent
    },
    { path: 'handover-sessions-3pl', component: HandoverSessions3PLComponent },
    {
        path: 'handover-sessions-3pl/:id',
        component: HandoverSessionsDetail3PLComponent
    },
    { path: ':id', component: OrderDetailControllerComponent },
    { path: ':id/:conversationId', component: OrderDetailControllerComponent }
];

@NgModule({
    imports: [
        ActivityModule,
        AdminModule,
        AgmCoreModule,
        AgmDirectionModule,
        AgmSnazzyInfoWindowModule,
        AngularFireDatabaseModule,
        AngularFireModule,
        AppTranslationModule,
        CommonModule,
        DeliveryModule,
        FormsModule,
        LocationModule,
        MessengerModule,
        NgbModule,
        OrderModule,
        ReportModule,
        RouterModule.forChild(routes),
        ServicerModule,
        UtilityModule,
        WarrantyRepairModule,
        WarehouseModule,
        NzTabsModule
    ],
    declarations: [
        EditOrderCollectionComponent,
        OrderCancelComponent,
        OrderDeleteMarkerComponent,
        OrderDetailComponent,
        OrderDetailControllerComponent,
        OrderDetailServicesComponent,
        OrderHistoryComponent,
        OrderManagementComponent,
        OrderMapComponent,
        OrderModalComponent,
        OrderReachModalComponent,
        OrderRefundComponent,
        OrderSkipMarkerComponent,
        PointDetailComponent,
        ReturnFilterComponent,
        ReturnManagementComponent,
        NewOrderCancelComponent,
        LoadingServicesComponent,
        WarrantyRepairPointMoreDetailComponent,
        PointProductComponent,
        PointServiceComponent,
        PointIncidentComponent,
        ReverOrderStatusModalComponent,
        HandoverSessionsComponent,
        HandoverSessionsListComponent,
        HandoverSessionsFiltersComponent,
        HandoverSessionsDetailComponent,
        HandoverSessionsCompleteModalComponent,

        HandoverSessions3PLComponent,
        HandoverSessionsList3PLComponent,
        HandoverSessionsFilters3PLComponent,
        HandoverSessionsDetail3PLComponent,

        ReportListComponent
    ],
    providers: [
        OrderDetailService,
        HandoverSessionsService,
        HandoverSessions3PLService
    ],
    entryComponents: [
        EditOrderCollectionComponent,
        OrderCancelComponent,
        OrderDeleteMarkerComponent,
        OrderReachModalComponent,
        OrderRefundComponent,
        OrderSkipMarkerComponent,
        PointDetailComponent,
        PointProductComponent,
        ReverOrderStatusModalComponent
    ],
    exports: [
        OrderHistoryComponent,
        HandoverSessionsListComponent,
        HandoverSessionsCompleteModalComponent,

        HandoverSessions3PLComponent,
        HandoverSessionsList3PLComponent,
        HandoverSessionsFilters3PLComponent,
        HandoverSessionsDetail3PLComponent
    ]
})
export class OrderManagementModule {}
