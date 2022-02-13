import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UtilityModule } from '@/modules/utility/utility.module';
import { VehicleEditorComponent } from './components/modals/vehicle-editor/vehicle-editor.component';
import { VehicleService } from './../delivery/services/vehicle.service';

@NgModule({
    imports: [
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        FormsModule,
        UtilityModule
    ],
    declarations: [VehicleEditorComponent],
    providers: [VehicleService],
    exports: [VehicleEditorComponent]
})
export class VehicleModule {}
