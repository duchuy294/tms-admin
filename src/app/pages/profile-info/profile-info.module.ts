import { AppHttpModule } from './../../modules/http/app-http.module';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ProfileInfoService } from './services/profile-info.service';
import { RouterModule, Routes } from '@angular/router';
import { UpdateProfileInfoComponent } from './components/update-profile-info/update-profile-info.component';
import { UtilityModule } from './../../modules/utility/utility.module';

const routes: Routes = [
    { path: 'profile', component: ProfileInfoComponent }
];

@NgModule({
    imports: [
        AppHttpModule,
        AppTranslationModule,
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule.forChild(routes),
        UtilityModule,
    ],
    declarations: [
        ChangePasswordComponent,
        ProfileInfoComponent,
        UpdateProfileInfoComponent,
    ],
    entryComponents: [
        ChangePasswordComponent,
        UpdateProfileInfoComponent,
    ],
    providers: [
        ProfileInfoService,
    ]
})
export class ProfileInfoModule { }
