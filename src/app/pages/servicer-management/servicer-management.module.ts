import { AppHttpModule } from './../../modules/http/app-http.module';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { CollectionOrderComponent } from './components/servicer/collection-order/collection-order.component';
import { CommonModule } from '@angular/common';
import { CustomerService } from './../../modules/customer/services/customer.service';
import { CustomerServiceObservable } from './../../modules/customer/services/customer.service.observable';
import { DeliveryModule } from '../../modules/delivery/delivery.module';
import { FilterServicerComponent } from './components/filter-servicer/filter-servicer.component';
import { FilterServicerNewComponent } from './components/filter-servicer-new/filter-servicer-new.component';
import { FinanceModule } from '../../modules/finance/finance.module';
import { FormsModule } from '@angular/forms';
import { GroupServicerDetailComponent } from './components/group-servicer/group-servicer-detail/group-servicer-detail.component';
import { GroupServicerDetailFilterComponent } from './components/group-servicer/group-servicer-detail/group-servicer-detail-filter/group-servicer-detail-filter.component';
import { GroupServicerDetailGridComponent } from './components/group-servicer/group-servicer-detail/group-servicer-detail-grid/group-servicer-detail-grid.component';
import { GroupServicerDetailInformationComponent } from './components/group-servicer/group-servicer-detail/group-servicer-detail-information/group-servicer-detail-information.component';
import { GroupServicerDetailListComponent } from './components/group-servicer/group-servicer-detail/group-servicer-detail-list/group-servicer-detail-list.component';
import { GroupServicerFilterComponent } from './components/group-servicer/group-servicer-filter/group-servicer-filter.component';
import { GroupServicerGridComponent } from './components/group-servicer/group-servicer-grid/group-servicer-grid.component';
import { GroupServicerManagementComponent } from './components/group-servicer/group-servicer-management/group-servicer-management.component';
import { GroupServicerModifyComponent } from './components/group-servicer/group-servicer-modify/group-servicer-modify.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrderModule } from './../../modules/order/order.module';
import { RouterModule, Routes } from '@angular/router';
import { ServicerDetailComponent } from './components/servicer/servicer-detail/servicer-detail.component';
import { ServicerManagementComponent } from './components/servicer/servicer-management/servicer-management.component';
import { ServicerMemberComponent } from './components/servicer/servicer-member/servicer-member.component';
import { ServicerModifyComponent } from './components/servicer/servicer-modify/servicer-modify.component';
import { ServicerModule } from '../../modules/servicer/servicer.module';
import { TeamServicerDetailComponent } from './components/team-servicer/team-servicer-detail/team-servicer-detail.component';
import { TeamServicerDetailFilterComponent } from './components/team-servicer/team-servicer-detail/team-servicer-detail-filter/team-servicer-detail-filter.component';
import { TeamServicerDetailGridComponent } from './components/team-servicer/team-servicer-detail/team-servicer-detail-grid/team-servicer-detail-grid.component';
import { TeamServicerDetailInformationComponent } from './components/team-servicer/team-servicer-detail/team-servicer-detail-information/team-servicer-detail-information.component';
import { TeamServicerDetailListComponent } from './components/team-servicer/team-servicer-detail/team-servicer-detail-list/team-servicer-detail-list.component';
import { TeamServicerFilterComponent } from './components/team-servicer/team-servicer-filter/team-servicer-filter.component';
import { TeamServicerGridComponent } from './components/team-servicer/team-servicer-grid/team-servicer-grid.component';
import { TeamServicerManagementComponent } from './components/team-servicer/team-servicer-management/team-servicer-management.component';
import { TeamServicerModifyComponent } from './components/team-servicer/team-servicer-modify/team-servicer-modify.component';
import { UserModule } from '@/modules/user/user.module';
import { UtilityModule } from './../../modules/utility/utility.module';


const routes: Routes = [
    { path: 'servicer', component: ServicerManagementComponent },
    { path: 'servicer/detail/:id', component: ServicerDetailComponent },
    { path: 'group', component: GroupServicerManagementComponent },
    { path: 'group/detail/:id', component: GroupServicerDetailComponent },
    { path: 'team', component: TeamServicerManagementComponent },
    { path: 'team/detail/:id', component: TeamServicerDetailComponent }
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
        UserModule,
        UtilityModule,
    ],
    providers: [
        CustomerService,
        CustomerServiceObservable,
    ],
    declarations: [
        CollectionOrderComponent,
        FilterServicerComponent,
        GroupServicerDetailComponent,
        GroupServicerManagementComponent,
        GroupServicerModifyComponent,
        ServicerDetailComponent,
        ServicerManagementComponent,
        ServicerMemberComponent,
        ServicerModifyComponent,
        TeamServicerDetailComponent,
        TeamServicerManagementComponent,
        TeamServicerModifyComponent,
        FilterServicerNewComponent,
        TeamServicerFilterComponent,
        TeamServicerGridComponent,
        GroupServicerFilterComponent,
        GroupServicerGridComponent,
        TeamServicerDetailGridComponent,
        TeamServicerDetailFilterComponent,
        TeamServicerDetailInformationComponent,
        TeamServicerDetailListComponent,
        GroupServicerDetailFilterComponent,
        GroupServicerDetailGridComponent,
        GroupServicerDetailListComponent,
        GroupServicerDetailInformationComponent,
    ],
    entryComponents: [
        CollectionOrderComponent,
        ServicerMemberComponent,
        ServicerModifyComponent,
        TeamServicerModifyComponent,
    ]
})
export class ServicerManagementModule { }