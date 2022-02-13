import { ApiHookHttpService } from './services/api-hook-http.service';
import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { CreateHookLinkComponent } from './components/modals/create-hook-link/create-hook-link.component';
import { CreateHookTypeComponent } from './components/modals/create-hook-type/create-hook-type.component';
import { CustomerModule } from '@/modules/customer/customer.module';
import { FilterHookLinkComponent } from './components/filter/filter-hook-link/filter-hook-link.component';
import { FilterHookTypeComponent } from './components/filter/filter-hook-type/filter-hook-type.component';
import { FormsModule } from '@angular/forms';
import { HookLinkGridComponent } from './components/hook-link-grid/hook-link-grid.component';
import { HookLinkListComponent } from './components/hook-link-list/hook-link-list.component';
import { HookLinkService } from './services/hook-link.service';
import { HookTypeGridComponent } from './components/hook-type-grid/hook-type-grid.component';
import { HookTypeListComponent } from './components/hook-type-list/hook-type-list.component';
import { HookTypeService } from './services/hook-type.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServicerModule } from './../servicer/servicer.module';
import { UtilityModule } from '@/utility/utility.module';

@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        CustomerModule,
        FormsModule,
        NgbModule,
        RouterModule,
        ServicerModule,
        UtilityModule,
    ],
    declarations: [
        CreateHookLinkComponent,
        CreateHookTypeComponent,
        FilterHookLinkComponent,
        FilterHookTypeComponent,
        HookLinkGridComponent,
        HookLinkListComponent,
        HookTypeGridComponent,
        HookTypeListComponent,
    ],
    exports: [
        HookTypeListComponent,
        HookLinkListComponent,
    ],
    entryComponents: [],
    providers: [
        ApiHookHttpService,
        HookTypeService,
        HookLinkService,
    ]
})

export class HookModule { }