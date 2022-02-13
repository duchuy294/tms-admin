import * as i18n from 'ng-zorro-antd/i18n';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import localeVi from '@angular/common/locales/vi';
import localeViExtra from '@angular/common/locales/extra/vi';
import { AdminModule } from './modules/admin/admin.module';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessaging, AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
import { AppComponent } from './components/app.component';
import { AppState, InternalStateType } from './app.service';
import { AppTranslationModule } from './modules/app-translation/app-translation.module';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { EmptyContentComponent } from './components/empty-content/empty-content.component';
import { environment } from 'environments/environment';
import { EventBusService } from './services/event.bus.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalState } from './global.state';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClientModule } from '@angular/common/http';
import { ModalService } from './modules/modal/services/modal.service';
import { NgaModule } from './modules/theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NotificationModule } from './modules/notification/notification.module';
import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { OrderNotificationEffects } from './modules/notification/effects/order.notification.effects';
import { PagesModule } from './pages/pages.module';
import { ProfileModule } from './modules/profile/profile.module';
import { reducers } from './reducers';
import { registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './app.routing';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { CanActivateGuard } from './services/can-activate.guard';


export type StoreType = {
    state: InternalStateType;
    restoreInputValues: () => void;
    disposeOldHosts: () => void;
};

registerLocaleData(localeVi, 'vi', localeViExtra);
registerLocaleData(localeEn, 'en', localeEnExtra);

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, EmptyContentComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgaModule.forRoot(),
        NgbModule,
        PagesModule,
        routing,
        ProfileModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleMapsKey,
            libraries: ['places']
        }),
        AgmSnazzyInfoWindowModule,
        AgmDirectionModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireMessagingModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        StoreModule.forRoot(reducers),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !environment.production }),
        EffectsModule.forRoot([OrderNotificationEffects]),
        HighchartsChartModule,
        NotificationModule,
        AdminModule,
        AppTranslationModule
    ],
    providers: [
        AppState,
        GlobalState,
        AuthService,
        EventBusService,
        ModalService,
        AngularFireMessaging,
        CanActivateGuard,
        {
            provide: NZ_I18N,
            useValue: i18n[`${localStorage.getItem('language') || 'vi'}_${localStorage.getItem('region') || 'VN'}`]
        },
        {
            provide: NZ_CONFIG,
            useValue: {
                empty: {
                    nzDefaultEmptyContent: EmptyContentComponent
                }
            }
        }
    ]
})
export class AppModule {
    constructor(public appState: AppState) { }
}
