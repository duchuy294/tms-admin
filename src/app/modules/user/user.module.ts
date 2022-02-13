import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { CreateUserLevelComponent } from './components/modals/create-user-level/create-user-level.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UserLevelService } from './services/user-level.service';
import { UtilityModule } from '@/modules/utility/utility.module';

@NgModule({
  imports: [
    AppTranslationModule,
    CKEditorModule,
    CommonModule,
    FormsModule,
    UtilityModule,
  ],
  declarations: [
    CreateUserLevelComponent,
  ],
  providers: [
    UserLevelService,
  ],
  exports: [
    CreateUserLevelComponent,
  ]
})
export class UserModule { }
