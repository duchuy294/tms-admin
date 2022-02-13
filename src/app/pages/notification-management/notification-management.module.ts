import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationModule } from '@/modules/notification/notification.module';
import { RouterModule, Routes } from '@angular/router';
import { UtilityModule } from '@/utility/utility.module';

const routes: Routes = [
  { path: '', component: NotificationComponent },
];

@NgModule({
  imports: [
    AppTranslationModule,
    CommonModule,
    FormsModule,
    NotificationModule,
    RouterModule.forChild(routes),
    UtilityModule,
  ],
  declarations: [
    NotificationComponent,
  ]
})
export class NotificationManagementModule { }

