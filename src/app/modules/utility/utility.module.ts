import { AddressComponent } from '../location/components/address/address.component';
import { AddressPipe } from './pipes/address.pipe';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { ApiCloudHttpService } from './services/api-cloud-http.service';
import { AppTranslationModule } from './../app-translation/app-translation.module';
import { AutocompleteGmapComponent } from './components/autocomplete-gmap/autocomplete-gmap.component';
import { ButtonComponent } from './components/button/button.component';
import { CloudService } from './services/cloud.service';
import { CommonModule } from '@angular/common';
import { ConditionComponent } from './components/condition-management/condition/condition.component';
import { ConditionItemComponent } from './components/condition-item/condition-item.component';
import { ConditionManagementComponent } from './components/condition-management/condition-management.component';
import { CreateMapsComponent } from './components/maps/create-maps/create-maps.component';
import { FilterDetailComponent } from './components/filter-detail/filter-detail.component';
import { FilterService } from './services/filter.service';
import { FormsModule } from '@angular/forms';
import { FromNowPipe } from './pipes/from-now.pipe';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { InputCurrencyComponent } from './components/currency/input-currency.component';
import { KeysPipe } from './pipes/keys.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { MappComponent } from './components/mapp/mapp.component';
import { MapsService } from './components/maps/maps.service';
import { MomentPipe } from './pipes/moment.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NormalMapsComponent } from './components/maps/normal-maps/normal-maps.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { OrderByPipe } from 'app/modules/utility/pipes/order-by.pipe';
import { OrderStatusFilterComponent } from './components/order-status-filter/order-status-filter.component';
import { PageWrapperComponent } from './components/page-wrapper/page-wrapper.component';
import { PagingComponent } from './components/paging/paging.component';
import { ProcessingModalComponent } from './components/processing-modal/processing-modal.component';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { RatingService } from '../order/services/rating.service';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPasswordModalComponent } from './components/reset-password-modal/reset-password-modal.component';
import { ReversePipe } from 'app/modules/utility/pipes/reverse.pipe';
import { RouterModule } from '@angular/router';
import { SearchAndSuggestAccountComponentComponent } from './search-and-suggest-account-component/search-and-suggest-account-component.component';
import { SessionService } from './services/session.service';
import { SpinnerProcessingModalComponent } from './components/spinner-processing-modal/spinner-processing-modal.component';
import { SplitPipe } from './pipes/split.pipe';
import { StatisticTileComponent } from './components/statistic-tile/statistic-tile.component';
import { StatusComponent } from './components/status/status.component';
import { TextMaskModule } from 'angular2-text-mask';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploadService } from 'app/modules/utility/services/upload.service';
import { UrlifyPipe } from './pipes/urlify.pipe';
import { ValueInputComponent } from './components/value-input/value-input.component';
import { VehicleItemComponent } from './components/vehicle-item/vehicle-item.component';
import { ViewMorePipe } from './pipes/view-more.pipe';

@NgModule({
    imports: [
        AgmCoreModule,
        AgmDirectionModule,
        AgmSnazzyInfoWindowModule,
        AppTranslationModule,
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule,
        TextMaskModule,
        NzFormModule,
        NzSelectModule,
        NzInputNumberModule,
        NzDatePickerModule,
        NzTagModule,
        NzTimePickerModule,
        NzInputModule,
        NzSpinModule,
        NzModalModule,
        NzTableModule,
        NzRateModule,
        NzUploadModule,
        NzToolTipModule,
        NzDropDownModule,
        NzRadioModule,
        NzButtonModule,
        NzCheckboxModule,
        NzSkeletonModule,
        NzDividerModule,
        NzIconModule,
        NzMessageModule,
        NzTabsModule,
        NzSwitchModule,
    ],
    providers: [
        ApiCloudHttpService,
        CloudService,
        FilterService,
        GoogleMapsAPIWrapper,
        MapsService,
        RatingService,
        SessionService,
        UploadService
    ],
    declarations: [
        AddressComponent,
        AddressPipe,
        AutocompleteGmapComponent,
        ButtonComponent,
        ConditionComponent,
        ConditionItemComponent,
        ConditionManagementComponent,
        CreateMapsComponent,
        FilterDetailComponent,
        FromNowPipe,
        ImageUploaderComponent,
        InputCurrencyComponent,
        KeysPipe,
        LoadingComponent,
        MappComponent,
        MomentPipe,
        NormalMapsComponent,
        OrderByPipe,
        OrderStatusFilterComponent,
        PageWrapperComponent,
        PagingComponent,
        ProcessingModalComponent,
        RatingListComponent,
        ResetPasswordModalComponent,
        ReversePipe,
        SearchAndSuggestAccountComponentComponent,
        SpinnerProcessingModalComponent,
        SplitPipe,
        StatusComponent,
        TimeAgoPipe,
        UploaderComponent,
        UrlifyPipe,
        ValueInputComponent,
        VehicleItemComponent,
        ViewMorePipe,
        StatisticTileComponent,
        ResetPasswordComponent
    ],
    exports: [
        AddressComponent,
        AddressPipe,
        AutocompleteGmapComponent,
        ButtonComponent,
        ConditionItemComponent,
        ConditionManagementComponent,
        CreateMapsComponent,
        FilterDetailComponent,
        FromNowPipe,
        ImageUploaderComponent,
        InputCurrencyComponent,
        KeysPipe,
        LoadingComponent,
        MappComponent,
        MomentPipe,
        NormalMapsComponent,
        // NgZorroAntdModule,
        OrderByPipe,
        OrderStatusFilterComponent,
        PageWrapperComponent,
        PagingComponent,
        ProcessingModalComponent,
        RatingListComponent,
        ResetPasswordModalComponent,
        ReversePipe,
        SearchAndSuggestAccountComponentComponent,
        SpinnerProcessingModalComponent,
        SplitPipe,
        StatusComponent,
        TimeAgoPipe,
        UploaderComponent,
        UrlifyPipe,
        ValueInputComponent,
        VehicleItemComponent,
        ViewMorePipe,
        StatisticTileComponent,
        ResetPasswordComponent,
        NzFormModule,
        NzSelectModule,
        NzInputNumberModule,
        NzDatePickerModule,
        NzTagModule,
        NzTimePickerModule,
        NzInputModule,
        NzSpinModule,
        NzModalModule,
        NzTableModule,
        NzRateModule,
        NzUploadModule,
        NzToolTipModule,
        NzDropDownModule,
        NzRadioModule,
        NzButtonModule,
        NzCheckboxModule,
        NzSkeletonModule,
        NzDividerModule,
        NzIconModule,
        NzMessageModule,
        NzTabsModule,
        NzSwitchModule
    ],
    entryComponents: [
        AutocompleteGmapComponent,
        ButtonComponent,
        ResetPasswordModalComponent
    ]
})
export class UtilityModule { }
