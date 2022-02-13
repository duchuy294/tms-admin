import { AppTranslationModule } from '../app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { CreateModifyDeliveryPointComponent } from './components/customers/customer-detail/enduser/delivery-point-list/create-modify-delivery-point/create-modify-delivery-point.component';
import { CreateModifyEnduserModelComponent } from './components/customers/customer-detail/enduser/create-modify-enduser-model/create-modify-enduser-model.component';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { CustomerDetailInformationComponent } from './components/customers/customer-detail/customer-detail-information/customer-detail-information.component';
import { CustomerGridComponent } from './components/customers/customer-grid/customer-grid.component';
import { CustomerListComponent } from './components/customers/customer-list/customer-list.component';
import { CustomerModifyComponent } from './components/customers/customer-modify/customer-modify.component';
import { CustomerService } from './services/customer.service';
import { CustomerServiceObservable } from './services/customer.service.observable';
import { DeliveryPointFilterComponent } from './components/customers/customer-detail/enduser/delivery-point-list/delivery-point-filter/delivery-point-filter.component';
import { DeliveryPointGridComponent } from './components/customers/customer-detail/enduser/delivery-point-list/delivery-point-grid/delivery-point-grid.component';
import { DeliveryPointListComponent } from './components/customers/customer-detail/enduser/delivery-point-list/delivery-point-list.component';
import { DeliveryPointService } from './services/deliveryPoint.service';
import { DetailStaffComponent } from './components/customers/detail-staff/detail-staff.component';
import { EnduserGridComponent } from './components/customers/customer-detail/enduser/enduser-grid/enduser-grid.component';
import { EndUserListComponent } from './components/customers/customer-detail/enduser/enduser-list/enduser-list.component';
import { EndUserService } from './services/enduser.service';
import { EndUserServiceObservable } from './services/end-user.service.observable';
import { FilterComponent } from './components/filter/filter.component';
import { FilterCustomerComponent } from './components/filter/filter-customer/filter-customer.component';
import { FilterEnduserComponent } from './components/customers/customer-detail/enduser/filter-enduser/filter-enduser.component';
import { FilterOrderCustomerComponent } from './components/filter/filter-order-customer/filter-order-customer.component';
import { FinanceModule } from '../finance/finance.module';
import { FormsModule } from '@angular/forms';
import { GridDetailStaffComponent } from './components/customers/grid-detail-staff/grid-detail-staff.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrderModule } from '../order/order.module';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '@/utility/utility.module';

@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        FinanceModule,
        FormsModule,
        NgbModule,
        OrderModule,
        RouterModule,
        UtilityModule,
    ],
    providers: [
        CustomerService,
        CustomerServiceObservable,
        EndUserService,
        DeliveryPointService,
        EndUserServiceObservable,
    ],
    declarations: [
        CustomerDetailComponent,
        CustomerDetailInformationComponent,
        CustomerGridComponent,
        CustomerListComponent,
        CustomerModifyComponent,
        DetailStaffComponent,
        FilterComponent,
        FilterCustomerComponent,
        FilterOrderCustomerComponent,
        GridDetailStaffComponent,
        CreateModifyEnduserModelComponent,
        EndUserListComponent,
        FilterEnduserComponent,
        DeliveryPointListComponent,
        DeliveryPointGridComponent,
        DeliveryPointFilterComponent,
        CreateModifyDeliveryPointComponent,
        EnduserGridComponent,
    ],
    exports: [
        CustomerDetailComponent,
        CustomerListComponent,
    ]
})
export class CustomerModule { }
