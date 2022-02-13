import { ActivityService } from '../activity/services/activity.service';
import { ApiNotificationHttpService } from './services/api-notification.service';
import { AppTranslationModule } from '../app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { FilterNotificationComponent } from './components/filter/filter-notification/filter-notification.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NotificationGridComponent } from './components/notification-grid/notification-grid.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationService } from './services/notification.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { reducer } from './reducers';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { UtilityModule } from '@/utility/utility.module';

@NgModule({
  imports: [
    AppTranslationModule,
    CommonModule,
    FormsModule,
    RouterModule,
    StoreModule.forFeature('notification', reducer),
    UtilityModule,
    NzAlertModule,
    NzNotificationModule,
  ],
  providers: [
    ActivityService,
    ApiNotificationHttpService,
    NotificationService,
  ],
  declarations: [
    FilterNotificationComponent,
    NotificationGridComponent,
    NotificationListComponent,
  ],
  exports: [
    NotificationListComponent,
  ]
})
export class NotificationModule { }
