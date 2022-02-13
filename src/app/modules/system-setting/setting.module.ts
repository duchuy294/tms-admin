import { AddAdidiBranchModalComponent } from './components/city-province/modals/add-adidi-branch-modal/add-adidi-branch-modal.component';
import { AddCityModalComponent } from './components/city-province/modals/add-city-modal/add-city-modal.component';
import { AddEditDistrictModalComponent } from './components/city-province/modals/add-edit-district-modal/add-edit-district-modal.component';
import { AddEditWardsModalComponent } from './components/city-province/modals/add-edit-wards-modal/add-edit-wards-modal.component';
import { AddEditReturnWarehouseModalComponent } from './components/city-province/modals/add-edit-return-warehouse-modal/add-edit-return-warehouse-modal.component';
import { AddRegionModalComponent } from './components/city-province/modals/add-region-modal/add-region-modal.component';
import { AdidiBranchGridComponent } from './components/city-province/adidi-branch-grid/adidi-branch-grid.component';
import { AdidiBranchListComponent } from '@/modules/system-setting/components/city-province/adidi-branch-list/adidi-branch-list.component';
import { ApiSystemHttpService } from './services/api-system-http.service';
import { AppTranslationModule } from '../app-translation/app-translation.module';
import { CityProvinceGridComponent } from './components/city-province/city-province-grid/city-province-grid.component';
import { CityProvinceListComponent } from './components/city-province/city-province-list/city-province-list.component';
import { CommonModule } from '@angular/common';
import { DistrictGridComponent } from './components/city-province/district-grid/district-grid.component';
import { DistrictListComponent } from './components/city-province/district-list/district-list.component';
import { WardsListComponent } from './components/city-province/wards-list/wards-list.component';
import { WardsGridComponent } from './components/city-province/wards-grid/wards-grid.component';
import { FormsModule } from '@angular/forms';
import { LocationModule } from '../location/location.module';
import { MenuService } from './services/menu.service';
import { NgModule } from '@angular/core';
import { RegionGridComponent } from './components/city-province/region-grid/region-grid.component';
import { RegionListComponent } from './components/city-province/region-list/region-list.component';
import { ReturnWarehouseGridComponent } from './components/city-province/return-warehouse-grid/return-warehouse-grid.component';
import { ReturnWarehouseListComponent } from './components/city-province/return-warehouse-list/return-warehouse-list.component';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { UtilityModule } from '@/utility/utility.module';


@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        FormsModule,
        LocationModule,
        RouterModule,
        TextMaskModule,
        UtilityModule,
    ],
    providers: [
        ApiSystemHttpService,
        MenuService,
    ],
    declarations: [
        AddAdidiBranchModalComponent,
        AddCityModalComponent,
        AddEditDistrictModalComponent,
        AddEditWardsModalComponent,
        AddEditReturnWarehouseModalComponent,
        AddRegionModalComponent,
        AdidiBranchGridComponent,
        AdidiBranchListComponent,
        CityProvinceGridComponent,
        CityProvinceListComponent,
        DistrictGridComponent,
        DistrictListComponent,
        WardsGridComponent,
        WardsListComponent,
        RegionGridComponent,
        RegionListComponent,
        ReturnWarehouseGridComponent,
        ReturnWarehouseListComponent
    ],
    exports: [
        AdidiBranchGridComponent,
        AdidiBranchListComponent,
        CityProvinceGridComponent,
        CityProvinceListComponent,
        DistrictListComponent,
        WardsGridComponent,
        WardsListComponent,
        RegionGridComponent,
        RegionListComponent,
        ReturnWarehouseGridComponent,
        ReturnWarehouseListComponent,
    ]
})
export class SettingModule { }