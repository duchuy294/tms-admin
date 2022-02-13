import { AppTranslationModule } from './../app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServicerEffects } from './effects/servicer.effect';
import { ServicerGridComponent } from './components/servicer-grid/servicer-grid.component';
import { ServicerInputComponent } from './components/servicer-input/servicer-input.component';
import { ServicerSelectionComponent } from './components/servicer-selection/servicer-selection.component';
import { ServicerService } from './services/servicer.service';
import { ServicerServiceObservable } from './services/servicer.service.observable';
import { UtilityModule } from '../utility/utility.module';

@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule,
        UtilityModule,
        EffectsModule.forFeature([ServicerEffects])
    ],
    providers: [ServicerService, ServicerServiceObservable],
    declarations: [
        ServicerGridComponent,
        ServicerInputComponent,
        ServicerSelectionComponent,
    ],
    entryComponents: [
        ServicerSelectionComponent,
    ],
    exports: [
        ServicerGridComponent,
        ServicerInputComponent,
        ServicerSelectionComponent,
    ]
})
export class ServicerModule { }
