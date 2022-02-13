import { AppHttpModule } from './../http/app-http.module';
import { NgModule } from '@angular/core';
import { ProfileService } from './services/admin.service';
import { ValidationService } from './services/validation.Service';

@NgModule({
    imports: [AppHttpModule],
    providers: [
        ProfileService,
        ValidationService,
    ]
})
export class ProfileModule { }
