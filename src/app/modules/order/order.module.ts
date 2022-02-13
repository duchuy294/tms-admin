import { ApiOrderHttpService } from 'app/modules/order/services/api-order-http.service';
import { AppTranslationModule } from './../app-translation/app-translation.module';
import { CollectionDebtGridComponent } from './components/collection-debt-grid/collection-debt-grid.component';
import { CollectionDebtHistoryComponent } from './components/modals/collection-debt-history/collection-debt-history.component';
import { LocationComponent } from './components/modals/location/location.component';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../customer/services/customer.service';
import { EndUserServiceObservable } from '../customer/services/end-user.service.observable';
import { FilterLimitOrdersComponent } from './components/filter/filter-limit-orders/filter-limit-orders.component';
import { FilterOrderComponent } from './components/filter/filter-order/filter-order.component';
import { FilterRestrictedReachComponent } from './components/filter/filter-restricted-reach/filter-restricted-reach.component';
import { FilterRestrictedTimeoutComponent } from './components/filter/filter-restricted-timeout/filter-restricted-timeout.component';
import { FormsModule } from '@angular/forms';
import { LimitOrdersComponent } from 'app/modules/order/components/limit-orders/limit-orders.component';
import { LimitOrdersModifyComponent } from './components/limit-orders-modify/limit-orders-modify.component';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { OperatorNoteComponent } from './components/operator-note/operator-note.component';
import { OrderGridComponent } from './components/order-grid/order-grid.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderService } from './services/order.service';
import { OrderStatisticCustomerDetailComponent } from './components/statistic/order-statistic-customer-detail/order-statistic-customer-detail.component';
import { OrderStatisticService } from './services/order-statistic.service';
import { RestrictedReachComponent } from 'app/modules/order/components/restricted-reach/restricted-reach.component';
import { RestrictedReachModifyComponent } from 'app/modules/order/components/restricted-reach-modify/restricted-reach-modify.component';
import { RestrictedReachService } from 'app/modules/order/services/restricted-reach.service';
import { RestrictedTimeoutComponent } from './components/restricted-timeout/restricted-timeout.component';
import { RestrictedTimeoutModifyComponent } from './components/restricted-timeout-modify/restricted-timeout-modify.component';
import { RestrictedTimeoutService } from './services/restricted-timeout.service';
import { RouterModule } from '@angular/router';
import { SearchAndSuggestEndUserComponentComponent } from '../customer/components/customers/customer-detail/enduser/search-and-suggest-end-user-component/search-and-suggest-end-user-component.component';
import { SerialNumberListComponent } from './components/modals/serial-number-list/serial-number-list.component';
import { ServicerModule } from '../servicer/servicer.module';
import { TextMaskModule } from 'angular2-text-mask';
import { UtilityModule } from './../utility/utility.module';
import { QuickCancelOrderComponent } from './components/modals/quick-cancel-order/quick-cancel-order.component';
import { QuickAssign3plComponent } from './components/modals/quick-assign-3pl/quick-assign-3pl.component';

@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ServicerModule,
        UtilityModule,
        TextMaskModule,
        NzGridModule,
    ],
    providers: [
        EndUserServiceObservable,
        ApiOrderHttpService,
        CustomerService,
        OrderService,
        RestrictedReachService,
        RestrictedTimeoutService,
        OrderStatisticService,
    ],
    declarations: [
        CollectionDebtGridComponent,
        CollectionDebtHistoryComponent,
        FilterOrderComponent,
        FilterRestrictedReachComponent,
        FilterRestrictedTimeoutComponent,
        FilterLimitOrdersComponent,
        OrderGridComponent,
        OrderListComponent,
        RestrictedReachComponent,
        RestrictedReachModifyComponent,
        RestrictedTimeoutComponent,
        RestrictedTimeoutModifyComponent,
        LimitOrdersComponent,
        LimitOrdersModifyComponent,
        SerialNumberListComponent,
        OrderStatisticCustomerDetailComponent,
        OperatorNoteComponent,
        SearchAndSuggestEndUserComponentComponent,
        LocationComponent,
        QuickCancelOrderComponent,
        QuickAssign3plComponent
    ],
    exports: [
        CollectionDebtHistoryComponent,
        OrderGridComponent,
        OrderListComponent,
        RestrictedReachComponent,
        RestrictedTimeoutComponent,
        SerialNumberListComponent,
        OrderStatisticCustomerDetailComponent,
        OperatorNoteComponent,
        SearchAndSuggestEndUserComponentComponent,
        LimitOrdersComponent,
        LocationComponent,
    ]
})
export class OrderModule { }
