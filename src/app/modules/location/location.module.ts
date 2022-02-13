import { ApiLocationHttpService } from './services/api-location-http.service';
import { ApiLocationHttpServiceObservable } from './services/api-location-http.service.observable';
import { LocationService } from './services/location.service';
import { LocationServiceObservable } from './services/location.service.observable';
import { NgModule } from '@angular/core';

@NgModule({
    providers: [
        ApiLocationHttpService,
        ApiLocationHttpServiceObservable,
        LocationService,
        LocationServiceObservable,
    ]
})
export class LocationModule { }