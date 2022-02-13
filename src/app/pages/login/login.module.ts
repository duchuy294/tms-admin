import { AppHttpModule } from './../../modules/http/app-http.module';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginService } from './services/login.service';
import { NgaModule } from './../../modules/theme/nga.module';
import { NgModule } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { routing } from './login.routing';
import { UtilityModule } from './../../modules/utility/utility.module';

@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        AppHttpModule,
        UtilityModule,
        routing,
        NzAlertModule,
    ],
    declarations: [
        LoginComponent
    ],
    providers: [LoginService]
})
export class LoginModule { }
