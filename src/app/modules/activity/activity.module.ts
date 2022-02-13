import { ActivityService } from './services/activity.service';
import { ApiActivityHttpService } from './services/api-activity-http.service';
import { NgModule } from '@angular/core';

@NgModule({
    providers: [
        ActivityService,
        ApiActivityHttpService,
    ]
})
export class ActivityModule { }