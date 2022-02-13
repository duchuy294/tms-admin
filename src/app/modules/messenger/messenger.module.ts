import { AdminModule } from '../admin/admin.module';
import { ApiMessengerHttpService } from './services/api-messenger-http.service';
import { AppTranslationModule } from './../app-translation/app-translation.module';
import { CloudService } from '@/utility/services/cloud.service';
import { CommonModule } from '@angular/common';
import { CustomerModule } from './../customer/customer.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MessageComponent } from './components/message/message.component';
import { MessengerBarComponent } from './components/messenger-bar/messenger-bar.component';
import { MessengerPopupComponent } from './components/messenger-popup/messenger-popup.component';
import { MessengerService } from './services/messenger.service';
import { MessengerTabComponent } from './components/messenger-tab/messenger-tab.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServicerModule } from '../servicer/servicer.module';
import { UploadService } from '@/utility/services/upload.service';
import { UtilityModule } from './../utility/utility.module';

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CommonModule,
        CustomerModule,
        FormsModule,
        InfiniteScrollModule,
        LazyLoadImageModule,
        RouterModule,
        ServicerModule,
        UtilityModule,
    ],
    declarations: [
        MessageComponent,
        MessengerBarComponent,
        MessengerPopupComponent,
        MessengerTabComponent,
    ],
    exports: [
        MessengerBarComponent,
    ],
    providers: [
        ApiMessengerHttpService,
        CloudService,
        MessengerService,
        UploadService,
    ]
})
export class MessengerModule { }