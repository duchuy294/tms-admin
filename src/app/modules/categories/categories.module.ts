import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CategoryEditorComponent } from './components/modals/vehicle-editor/category-editor.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UtilityModule } from '@/modules/utility/utility.module';
import { VehicleService } from '../delivery/services/vehicle.service';

@NgModule({
    imports: [
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        FormsModule,
        UtilityModule
    ],
    declarations: [CategoryEditorComponent],
    providers: [VehicleService],
    exports: [CategoryEditorComponent]
})
export class CategoriesModule {}
