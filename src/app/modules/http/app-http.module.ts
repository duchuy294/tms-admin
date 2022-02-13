import { ApiAuthHttpService } from './services/api-auth-http.service';
import { ApiHttpService } from './services/api-http.service';
import { ApiHttpServiceObservable } from './services/api-http.service.observable';
import { AppModalModule } from './../modal/modal.module';
import { HttpService } from './services/http.service';
import { HttpServiceObservable } from './services/http.service.observable';
import { NgModule } from '@angular/core';
import { UtilityModule } from './../utility/utility.module';

@NgModule({
    imports: [AppModalModule, UtilityModule],
    providers: [
        ApiAuthHttpService,
        ApiHttpService,
        ApiHttpServiceObservable,
        HttpService,
        HttpServiceObservable,
    ]
})
export class AppHttpModule { }
